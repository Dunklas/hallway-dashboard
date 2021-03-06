extern crate chrono;
extern crate ureq;

use chrono::{DateTime, Utc, TimeZone, LocalResult, NaiveDateTime, NaiveDate, NaiveTime};
use chrono_tz::Europe::Stockholm;
use serde::{Serialize, Deserialize};
use std::fmt;

#[derive(Deserialize, Serialize, Debug)]
pub struct Departure {
    number: String,
    stop: String,
    time: DateTime<Utc>,
    #[serde(rename = "realTime")]
    real_time: Option<DateTime<Utc>>,
    direction: String
}

#[derive(Deserialize, Debug)]
struct ExternalDeparture {
    stop: String,
    time: String,
    #[serde(rename = "rtTime")]
    rt_time: Option<String>,
    date: String,
    #[serde(rename = "rtDate")]
    rt_date: Option<String>,
    direction: String,
    #[serde(rename = "transportNumber")]
    transport_number: String
}

#[derive(Deserialize, Debug)]
struct Response {
    #[serde(rename = "Departure")]
    departure: Vec<ExternalDeparture>
}

pub struct PublicTransportError {
    message: String
}

impl fmt::Display for PublicTransportError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "PublicTransportError: {}", self.message)
    }
}
impl fmt::Debug for PublicTransportError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!())
    }
}

fn server_url() -> String {
    #[cfg(not(test))]
    let url = String::from("https://api.resrobot.se");
    #[cfg(test)]
    let url = mockito::server_url();
    return url;
}

pub fn get_public_transport(api_key: String, stop_id: String, direction: Option<String>) -> Result<Vec<Departure>, PublicTransportError> {
    let mut query_string = format!("?key={}&id={}&passlist=0&format=json", api_key, stop_id);
    if direction.is_some() {
        query_string.push_str(&format!("&direction={}", direction.unwrap()));
    }
    let res = ureq::get(&[server_url(), "/v2/departureBoard".to_string()].join(""))
        .query_str(&query_string)
        .call();
    if !res.ok() {
        return Err(PublicTransportError{
            message: "Failed while making public transport API call".to_string()
        });
    }
    let json = res.into_json_deserialize::<Response>();
    if json.is_err() {
        return Err(PublicTransportError{
                message: "Failed while parsing public transport API response".to_string()
            });
    }
    let mut transformed_response = Vec::<Departure>::new();
    for dep in json.unwrap().departure {
        let time = match to_datetime(dep.date, dep.time) {
            Some(time) => time,
            None => {
                return Err(PublicTransportError{
                    message: "Failed while parsing public transport API response".to_string()
                });
            }
        };
        let optional_real_time = to_datetime_from_optional(dep.rt_date, dep.rt_time);
        transformed_response.push(Departure{
            number: dep.transport_number,
            stop: dep.stop,
            time: time,
            real_time: optional_real_time,
            direction: dep.direction
        });
    }
    return Ok(transformed_response);
}

fn to_datetime_from_optional(date: Option<String>, time: Option<String>) -> Option<DateTime<Utc>> {
    if date.is_none() || time.is_none() {
        return None;
    }
    return to_datetime(date.unwrap(), time.unwrap());
}

fn to_datetime(date: String, time: String) -> Option<DateTime<Utc>> {
    let date = match NaiveDate::parse_from_str(&date, "%Y-%m-%d") {
        Ok(parsed) => parsed,
        Err(_e) => {
            return None;
        }
    };
    let time = match NaiveTime::parse_from_str(&time, "%H:%M:%S") {
        Ok(parsed) => parsed,
        Err(_e) => {
            return None;
        }
    };
    let naive_datetime = NaiveDateTime::new(date, time);
    let sweden_time = match Stockholm.from_local_datetime(&naive_datetime) {
        LocalResult::Single(parsed) => parsed,
        LocalResult::Ambiguous(_a, _b) => {
            return None;
        },
        LocalResult::None => {
            return None;
        }
    };
    return Some(sweden_time.with_timezone(&Utc));
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::{mock, Matcher};

    #[test]
    fn test_public_transport() {
        let api_key = "SOME_KEY".to_string();
        let stop_id = "740025692".to_string();
        let direction = "740015569".to_string();
        let mock = mock("GET", Matcher::Regex(format!(r"^/v2/departureBoard\?key={}&id={}&passlist=0&format=json&direction={}$", api_key, stop_id, direction).to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/public_transport.json")
            .create();
        let public_transport_response = get_public_transport(api_key, stop_id, Some(direction));
        mock.assert();
        assert!(public_transport_response.is_ok());

        let public_transport = public_transport_response.unwrap();
        assert_eq!(25, public_transport.len());

        let departure = public_transport.get(0).unwrap();
        assert_eq!("6", departure.number);
        assert_eq!("Göteborg Temperaturgatan", departure.stop);
        assert_eq!("Kortedala Aprilgatan (Göteborg kn)", departure.direction);
        assert_eq!("2020-05-07T18:50:00+00:00", departure.time.to_rfc3339());
        assert_eq!("2020-05-07T18:52:00+00:00", departure.real_time.unwrap().to_rfc3339());
    }

    #[test]
    fn test_skip_direction_if_not_provided() {
        let api_key = "SOME_KEY".to_string();
        let stop_id = "740025692".to_string();
        let mock = mock("GET", Matcher::Regex(format!(r"^/v2/departureBoard\?key={}&id={}&passlist=0&format=json$", api_key, stop_id).to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/public_transport.json")
            .create();
        let _ = get_public_transport(api_key, stop_id, None);
        mock.assert();
    }
}
