use std::error::Error;

use lambda_runtime::{error::HandlerError, lambda, Context};
use simple_logger;
use serde_derive::{Deserialize, Serialize};

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
    weather::get_weather();
    Ok(EmptyOutput {})
}
