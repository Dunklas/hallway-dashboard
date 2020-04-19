extern crate chrono;
extern crate curl;

use chrono::{DateTime, Utc};
use std::io::{stdout, Write};
use curl::easy::Easy;

pub struct Weather {
    latitude: f64,
    longitude: f64,
    icon: String,
    time: DateTime<Utc>,
    temperature: f64,
    precip_type: String,
    precip_intensity: f64,
    precip_probability: f64,
    wind_gust: f64,
    wind_speed: f64,
    wind_bearing: i64,
}

fn server_url() -> String {
    #[cfg(not(test))]
    let url = String::from("https://api.darksky.net");
    #[cfg(test)]
    let url = mockito::server_url();
    return url;
}

pub fn get_weather() {
    let mut easy = Easy::new();
    easy.url(&[server_url(), String::from("/forecast/APIKEY/11.8898418,57.734112?units=si&exclude=currently,minutely,daily,alerts,flags")].join("")).unwrap();
    easy.write_function(|data| {
        Ok(stdout().write(data).unwrap())
    }).unwrap();
    easy.perform().unwrap();
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::{mock, Matcher};

    #[test]
    fn test_weather() {
        let mock = mock("GET", Matcher::Regex(r"^/forecast/.*/\d+\.\d+,\d+\.\d+\?units=si&exclude=currently,minutely,daily,alerts,flags".to_string()))
            .with_header("content-type", "application/json; charset=utf-8")
            .with_status(200)
            .with_body_from_file("files/weather.json")
            .create();
        get_weather();
        mock.assert()
    }
}