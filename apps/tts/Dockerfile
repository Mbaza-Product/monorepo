FROM tiangolo/uvicorn-gunicorn:python3.8

RUN apt-get update
RUN apt-get install -y libsndfile1
RUN pip install --upgrade pip

ENV PYTHONPATH /code
ENV PYTHONWRITEBYTECODE 1
ENV PYTHONBUFFERED 1
ENV APP_DEVICE cpu
ENV APP_FASTPITCH_MODEL_FILE nvidia_fastpitch_210824.pt

# Install the app
WORKDIR /code/tts
COPY . .
RUN pip install -r requirements.txt

# clone fastpitch
WORKDIR /code
RUN apt-get install -y git
RUN git clone https://github.com/NVIDIA/DeepLearningExamples.git NVIDIADeepLearning
WORKDIR /code/NVIDIADeepLearning
RUN git checkout -b tts a43ffd01cb002b23a98c97c3c5a231e24a57fa71

# install fastpitch requirements
RUN pip install setuptools==59.5.0
RUN pip install -r /code/NVIDIADeepLearning/PyTorch/SpeechSynthesis/FastPitch/requirements.txt
RUN pip install numpy==1.19.5
RUN pip install numba==0.53.1

# Fix FastPitch loading models with cpu support
RUN sed -i "s/torch.load(checkpoint_path)/torch.load(checkpoint_path, map_location=torch.device('cpu'))/g" /code/NVIDIADeepLearning/PyTorch/SpeechSynthesis/FastPitch/inference.py

# install fastpitch models
WORKDIR /code/NVIDIADeepLearning/PyTorch/SpeechSynthesis/FastPitch
RUN /code/tts/fastpitch/scripts/download_fastpitch.sh 1UtqaAsGVQA2iDI2GZSPEc5zK5pz7E7Wb nvidia_fastpitch_210824.pt
RUN /code/tts/fastpitch/scripts/download_waveglow.sh
RUN /code/tts/fastpitch/scripts/download_cmudict.sh

# app bootstrap
WORKDIR /code/tts
ARG SRV_PORT
ENV SRV_PORT "${SRV_PORT}"
EXPOSE ${SRV_PORT}

RUN chmod +x /code/tts/app/start.sh
ENTRYPOINT ["/code/tts/app/start.sh"]