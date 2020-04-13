use std::error::Error;

use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{self, error};
use simple_logger;
use serde_derive::{Deserialize, Serialize};

#[derive(Deserialize)]
struct EchoEvent {
    message: String,
}

#[derive(Serialize)]
struct CustomOutput {
    message: String,
}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Debug)?;
    lambda!(handleRequest);

    Ok(())
}

// https://robertohuertas.com/2018/12/02/aws-lambda-rust/
fn handleRequest(e: EchoEvent, c: Context) -> Result<CustomOutput, HandlerError> {
    Ok(CustomOutput {
        message: e.message,
    })
}
