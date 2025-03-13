#! /usr/bin/env sh
set -e

# Start Gunicorn
exec gunicorn -k "uvicorn.workers.UvicornWorker" -c "gunicorn_conf.py" "stt.app.main:app"

echo 'Hit CTRL+C or gunicorn -k "uvicorn.workers.UvicornWorker" -c "gunicorn_conf.py" "stt.app.main:app" &'
while :; do sleep 1; done
