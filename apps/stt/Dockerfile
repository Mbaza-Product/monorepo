FROM tiangolo/uvicorn-gunicorn:python3.8

RUN apt-get update
RUN apt-get install -y libsndfile1
RUN pip install --upgrade pip

ENV PYTHONPATH /code

# Install the app
WORKDIR /code/stt
COPY . .
RUN pip install -r requirements.txt

# app bootstrap
WORKDIR /code/stt
ARG SRV_PORT
ENV SRV_PORT "${SRV_PORT}"
EXPOSE ${SRV_PORT}

RUN chmod +x /code/stt/app/start.sh
ENTRYPOINT ["/code/stt/app/start.sh"]