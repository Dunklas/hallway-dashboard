use std::error::Error;
use std::env;

use lambda_runtime::{error::HandlerError, lambda, Context};
use simple_logger;
use log::{self, info};
use serde::{Deserialize, Serialize};

mod weather;

#[derive(Deserialize)]
struct EmptyEvent {}

#[derive(Serialize)]
struct EmptyOutput {}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(handle_request);
    Ok(())
}

fn handle_request(_e: EmptyEvent, _c: Context) -> Result<EmptyOutput, HandlerError> {
    let dark_sky_api_key = env::var("DARK_SKY_API_KEY").unwrap();
    let weather = weather::get_weather_forecast(dark_sky_api_key);
    info!("Response: {:?}", weather);
    Ok(EmptyOutput {})
}
