extern crate chrono;
extern crate ureq;

use chrono::{DateTime, Utc};
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
    rtTime: Option<String>,
    date: String,
    rtDate: Option<String>,
    direction: String,
    transportNumber: String
}

#[derive(Deserialize, Debug)]
struct Response {
    Departure: Vec<ExternalDeparture>
}

pub struct PublicTransportError {
    message: String
}

impl fmt::Display for PublicTransportError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "WeatherError: {}", self.message)
    }
}
impl fmt::Debug for PublicTransportError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!())
    }
}

fn server_url() -> String {
    #[cfg(not(test))]
    let url = String::from("https://api.resrobot.se/v2");
    #[cfg(test)]
    let url = mockito::server_url();
    return url;
}

pub fn get_public_transport(api_key: String) -> Result<Vec<Departure>, PublicTransportError> {
    let raw_response = get_public_transport_via_http(api_key)?;
    let response = match serde_json::from_slice::<Response>(raw_response.as_slice()) {
        Ok(parsed) => parsed,
        Err(_e) => {
            return Err(PublicTransportError{
                message: "Failed while parsing weather API response".to_string()
            });
        }
    };
    let mut transformed_response = Vec::<Departure>::new();
    for dep in response.Departure {
        transformed_response.push(Departure{
            number: dep.transportNumber,
            stop: dep.stop,
            time: Utc::now(),
            real_time: Some(Utc::now()),
            direction: dep.direction
        })
    }
    return Ok(transformed_response);
}

fn get_public_transport_via_http(api_key: String) -> Result<Vec::<u8>, PublicTransportError> {
    let res = ureq::get(&[server_url(), "/v2/departureBoard".to_string()].join(""))
        .query("key", &api_key)
        .query("id", "740025692")
        .query("passlist", "0")
        .query("format", "json")
        .query("direction", "740015569")
        .call();
    if !res.ok() {
        return Err(PublicTransportError{
            message: "Failed while making weather API call".to_string()
        });
    }
    let bytes = match res.into_string() {
        Ok(text) => {
            println!("{}", text);
            text.into_bytes()
        }
        Err(_e) => {
            return Err(PublicTransportError{
                message: "Failed while making weather API call".to_string()
            });
        }
    };
    return Ok(bytes);
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::{mock, Matcher};

    #[test]
    fn test_public_transport() {
        let mock = mock("GET", Matcher::Regex(r"^/v2/departureBoard\?key=SOME_KEY&id=\d+&passlist=0&format=json.*".to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/public_transport.json")
            .create();
        let public_transport_response = get_public_transport("SOME_KEY".to_string());
        mock.assert();
        assert!(public_transport_response.is_ok());

        let public_transport = public_transport_response.unwrap();
        assert_eq!(25, public_transport.len());
    }
}