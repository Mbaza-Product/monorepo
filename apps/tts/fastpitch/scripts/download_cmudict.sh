#!/usr/bin/env bash

set -e

MODEL_DIR="cmudict"

mkdir -p "$MODEL_DIR"

# Use this if you already have the pretrained_models
cp -r "/code/tts/pretrained_models" "$(pwd)"

echo "Downloading cmudict-0.7b ..."
gdown -q -O ${MODEL_DIR}/cmudict-0.7b 17MaO_yeKW8RPaZp8UpB0nNLPXYiF-aSd
