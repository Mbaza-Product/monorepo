FROM python:3.8-slim

RUN apt-get update
RUN apt-get install -y gcc portaudio19-dev
RUN pip install --upgrade pip
ENV PYTHONPATH /code

# Install the app
WORKDIR /code/orchestrator
COPY . .
RUN pip install -r requirements.txt

CMD ["/code/orchestrator/app/main.py"]
ENTRYPOINT ["python3"]