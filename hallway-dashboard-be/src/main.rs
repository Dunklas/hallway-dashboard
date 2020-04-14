mod weather;

use std::error::Error;

use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{self, error, info};
use simple_logger;
use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize)]
struct EmptyEvent {}

#[derive(Serialize)]
struct EmptyOutput {}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(handleRequest);
    Ok(())
}

fn handleRequest(e: EmptyEvent, c: Context) -> Result<EmptyOutput, HandlerError> {
    let weather_result = weather::get_weather();
    match weather_result {
        Some(weather) => info!("Weather downloaded"),
        None => error!("No weather downloaded :("),
    }
    Ok(EmptyOutput {})
}
