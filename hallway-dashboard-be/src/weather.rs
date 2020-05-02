extern crate chrono;
extern crate curl;

use chrono::{DateTime, Utc};
use chrono::serde::ts_seconds;
use curl::easy;
use serde::{Serialize, Deserialize};
use std::fmt;

#[derive(Deserialize, Serialize, Debug)]
pub struct Weather {
    icon: Option<String>,
    #[serde(with = "ts_seconds")]
    time: DateTime<Utc>,
    temperature: Option<f64>,
    #[serde(rename = "precipType")]
    precip_type: Option<String>,
    #[serde(rename = "precipIntensity")]
    precip_intensity: Option<f64>,
    #[serde(rename = "precipProbability")]
    precip_probability: Option<f64>,
    #[serde(rename = "windGust")]
    wind_gust: Option<f64>,
    #[serde(rename = "windSpeed")]
    wind_speed: Option<f64>,
    #[serde(rename = "windBearing")]
    wind_bearing: Option<i64>,
}

#[derive(Deserialize, Debug)]
struct Hourly {
    icon: String,
    data: Vec<Weather>
}

#[derive(Deserialize, Debug)]
struct Response {
    latitude: f64,
    longitude: f64,
    timezone: String,
    hourly: Hourly,
}

pub struct WeatherError {
    message: String
}

impl fmt::Display for WeatherError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "WeatherError: {}", self.message)
    }
}
impl fmt::Debug for WeatherError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{{ file: {}, line: {} }}", file!(), line!())
    }
}

fn server_url() -> String {
    #[cfg(not(test))]
    let url = String::from("https://api.darksky.net");
    #[cfg(test)]
    let url = mockito::server_url();
    return url;
}

pub fn get_weather_forecast(api_key: String) -> Result<Vec<Weather>, WeatherError> {
    let raw_response = match get_weather_via_http(api_key) {
        Ok(raw) => raw,
        Err(_e) => {
            return Err(WeatherError{
                message: "Failed while making weather API call".to_string()
            });
        }
    };

    let response = match serde_json::from_slice::<Response>(raw_response.as_slice()) {
        Ok(parsed) => parsed,
        Err(_e) => {
            return Err(WeatherError{
                message: "Failed while parsing weather API response".to_string()
            });
        }
    };
    return Ok(response.hourly.data);
}

fn get_weather_via_http(api_key: String) -> Result<Vec::<u8>, curl::Error> {
    let mut easy = easy::Easy::new();
    let mut buf = Vec::new();
    easy.fail_on_error(true)?;
    easy.url(&[server_url(), format!("/forecast/{}/11.8898418,57.734112?units=si&exclude=currently,minutely,daily,alerts,flags", api_key)].join(""))?;
    {
        let mut transfer = easy.transfer();
        transfer.write_function(|data| {
            buf.extend_from_slice(data);
            Ok(data.len())
        })?;
        transfer.perform()?;
    }
    return Ok(buf.clone());
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::{mock, Matcher};
    use float_cmp::ApproxEq;

    #[test]
    fn test_weather() {
        let mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/weather.json")
            .create();
        let weather_forecast_response = get_weather_forecast("SOME_API_KEY".to_string());
        mock.assert();
        assert!(weather_forecast_response.is_ok());

        let weather_forecast = weather_forecast_response.unwrap();
        assert_eq!(26, weather_forecast.len());

        let weather = weather_forecast.get(0).unwrap();
        assert_eq!("partly-cloudy-day", weather.icon.as_ref().unwrap());

        assert_eq!("2020-04-19T07:00:00+00:00", weather.time.to_rfc3339());
        assert!(29.61.approx_eq(weather.temperature.unwrap(), (0.0, 2)));
        assert!(weather.precip_type.is_none());
        assert!(0.0.approx_eq(weather.precip_intensity.unwrap(), (0.0, 2)));
        assert!(0.0.approx_eq(weather.precip_probability.unwrap(), (0.0, 2)));
        assert!(4.77.approx_eq(weather.wind_gust.unwrap(), (0.0, 2)));
        assert!(3.9.approx_eq(weather.wind_speed.unwrap(), (0.0, 2)));
        assert_eq!(72, weather.wind_bearing.unwrap());
    }

    #[test]
    fn test_weather_5xx_error() {
        let _mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_status(500);
        let weather_forecast_response = get_weather_forecast("SOME_API_KEY".to_string());
        assert!(weather_forecast_response.is_err());
        assert_eq!("Failed while making weather API call", weather_forecast_response.unwrap_err().message);
    }

    #[test]
    fn test_weather_4xx_error() {
        let _mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_status(400);
        let weather_forecast_response = get_weather_forecast("SOME_API_KEY".to_string());
        assert!(weather_forecast_response.is_err());
        assert_eq!("Failed while making weather API call", weather_forecast_response.unwrap_err().message);
    }

    #[test]
    fn test_weather_json_bad_structure() {
        let _mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/weather_bad_structure.json")
            .create();
        let weather_forecast_response = get_weather_forecast("SOME_API_KEY".to_string());
        assert!(weather_forecast_response.is_err());
        assert_eq!("Failed while parsing weather API response", weather_forecast_response.unwrap_err().message);
    }

    #[test]
    fn test_weather_not_json() {
        let _mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body("Some messed up body")
            .create();
        let weather_forecast_response = get_weather_forecast("SOME_API_KEY".to_string());
        assert!(weather_forecast_response.is_err());
        assert_eq!("Failed while parsing weather API response", weather_forecast_response.unwrap_err().message);
    }
}
