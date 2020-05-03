#!/bin/sh
cargo build --release --target x86_64-unknown-linux-musl
cp target/x86_64-unknown-linux-musl/release/bootstrap /tmp/lambda
docker run --rm -v /tmp/lambda:/var/task --env DARK_SKY_API_KEY=76b5d6cf1492665bcb2c5936162968a4 lambci/lambda:provided
