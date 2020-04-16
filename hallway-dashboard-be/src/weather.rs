extern crate chrono;
use chrono::{DateTime, Utc};
use std::error::Error;

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

pub fn get_weather() -> Option<Vec<Weather>> {
    let weather = Vec::<Weather>::new();
    return Some(weather);
}

#[cfg(test)]
mod tests {
    use super::*;
    use mockito::mock;

    #[test]
    fn test_weather() {
        let mock = mock("GET", "/forecast")
            .with_status(200)
           .create();
        get_weather();
        mock.assert()
    }
}