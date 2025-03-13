#!/usr/bin/env bash

set -e

: ${MODEL_DIR:="pretrained_models/waveglow"}
MODEL="nvidia_waveglow256pyt_fp16.pt"
MODEL_ZIP="${MODEL}.zip"
#https://api.ngc.nvidia.com/v2/models/nvidia/waveglow_ckpt_amp_256/versions/20.01.0/zip

mkdir -p "$MODEL_DIR"

# Use this if you already have the pretrained_models
cp -r "/code/tts/pretrained_models" "$(pwd)"

if [ ! -f "${MODEL_DIR}/${MODEL_ZIP}" ]; then
  echo "Downloading ${MODEL_ZIP} ..."
  gdown -q -O ${MODEL_DIR}/${MODEL_ZIP} 1Te43sUgofRgz8IZdWLaGl1Uwev02uIWL \
       || { echo "ERROR: Failed to download ${MODEL_ZIP} from NGC"; exit 1; }
fi

if [ ! -f "${MODEL_DIR}/${MODEL}" ]; then
  echo "Extracting ${MODEL} ..."
  unzip -qo ${MODEL_DIR}/${MODEL_ZIP} -d ${MODEL_DIR} \
        || { echo "ERROR: Failed to extract ${MODEL_ZIP}"; exit 1; }

  echo "OK"

else
  echo "${MODEL} already downloaded."
fi
