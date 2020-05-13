use std::error::Error;
use std::env;
use std::str::FromStr;

use lambda_runtime::{error::HandlerError, lambda, Context};
use simple_logger;
use log::{self, warn};
use serde::{Deserialize, Serialize};
use rusoto_core::{Region, ByteStream};
use rusoto_s3::{S3, S3Client, PutObjectRequest};
use tokio::runtime::Runtime;

mod weather;
mod public_transport;

#[derive(Deserialize)]
struct EmptyEvent {}

#[derive(Serialize)]
struct EmptyOutput {}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Info)?;
    lambda!(handle_request);
    Ok(())
}

fn handle_request(_e: EmptyEvent, _c: Context) -> Result<EmptyOutput, HandlerError> {
    let aws_region = Region::from_str(
        &env::var("AWS_REGION").unwrap()
    ).unwrap();
    let storage_bucket_name = env::var("STORAGE_BUCKET").unwrap();
    let s3_client = S3Client::new(aws_region);

    let mut run_time = Runtime::new()
        .expect("Failed to create Tokio runtime");

    let dark_sky_api_key = env::var("DARK_SKY_API_KEY").unwrap();
    run_time.block_on(get_and_store_weather(dark_sky_api_key, &s3_client, &storage_bucket_name));

    let trafiklab_api_key = env::var("TRAFIKLAB_API_KEY").unwrap();
    let stop_id = env::var("PUBLIC_TRANSPORT_STOP").unwrap();
    let direction = env::var("PUBLIC_TRANSPORT_DIRECTION").ok();
    run_time.block_on(get_and_store_public_transport(trafiklab_api_key, stop_id, direction, &s3_client, &storage_bucket_name));
    Ok(EmptyOutput{})
}

async fn get_and_store_weather(dark_sky_api_key: String, s3_client: &S3Client, bucket_name: &String) {
    let weather = match weather::get_weather_forecast(dark_sky_api_key) {
        Ok(weather) => weather,
        Err(e) => {
            warn!("Failed to get weather: {}", e);
            return;
        }
    };
    let bytes = match serde_json::to_vec(&weather) {
        Ok(bytes) => bytes,
        Err(_e) => {
            warn!("Failed to convert weather to bytes");
            return;
        }
    };
    let put_req = create_put_request(bucket_name.to_string(), "weather".to_string(), bytes);
    match s3_client.put_object(put_req).await {
        Ok(res) => res,
        Err(e) => {
            warn!("Failed to write to S3: {}", e);
            return;
        }
    };
}

async fn get_and_store_public_transport(trafiklab_api_key: String, stop_id: String, direction: Option<String>, s3_client: &S3Client, bucket_name: &String) {
    let public_transport = match public_transport::get_public_transport(trafiklab_api_key, stop_id, direction) {
        Ok(public_transport) => public_transport,
        Err(e) => {
            warn!("Failed to get public transport times: {}", e);
            return;
        }
    };
    let bytes = match serde_json::to_vec(&public_transport) {
        Ok(bytes) => bytes,
        Err(_e) => {
            warn!("Failed to convert weather to bytes");
            return;
        }
    };
    let put_req = create_put_request(bucket_name.to_string(), "public_transport".to_string(), bytes);
    match s3_client.put_object(put_req).await {
        Ok(res) => res,
        Err(e) => {
            warn!("Failed to write to S3: {}", e);
            return;
        }
    };
}

fn create_put_request(bucket_name: String, key: String, body: Vec<u8>) -> PutObjectRequest {
    let mut request = PutObjectRequest::default();
    request.bucket = bucket_name;
    request.key = key;
    request.body = Some(ByteStream::from(body));
    return request;
}