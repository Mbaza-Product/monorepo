import os
import logging

SRV_PORT = os.getenv("SRV_PORT", "4573")  # Default asterisk AGI port
SRV_HOST = os.getenv("SRV_HOST", "0.0.0.0")

USE_DEEPSPEECH = os.getenv("USE_DEEPSPEECH", "False").lower() in ["true", "1", "yes"]

TTS_API_URL = os.getenv("TTS_API_URL", "http://localhost:6901")  # trailing /speak is omitted here
TTS_API_URL_KIN = os.getenv("TTS_API_URL_KIN", "http://localhost:6903")  # trailing /speak is omitted here
TTS_API_USERNAME = os.getenv("TTS_API_USERNAME", "mbaza")
TTS_API_USERNAME_KIN = os.getenv("TTS_API_USERNAME_KIN", "mbaza")
TTS_API_PASSWORD = os.getenv("TTS_API_PASSWORD", "ttssecret")
TTS_API_PASSWORD_KIN = os.getenv("TTS_API_PASSWORD_KIN", "ttssecret")
TTS_CONNECTION_RETRY = int(os.getenv("TTS_CONNECTION_RETRY", 2))
TTS_CONNECTION_TIMEOUT = int(os.getenv("TTS_CONNECTION_TIMEOUT", 15))  # seconds

RASA_API_URL = os.getenv("RASA_API_URL", "http://localhost:5005/webhooks/rest/webhook")
RASA_API_URL_KIN = os.getenv("RASA_API_URL_KIN", "http://localhost:5005/webhooks/rest/webhook")
RASA_CONNECTION_RETRY = int(os.getenv("RASA_CONNECTION_RETRY", 2))
RASA_CONNECTION_TIMEOUT = int(os.getenv("RASA_CONNECTION_TIMEOUT", 10))  # seconds

STT_API_URL = os.getenv("STT_API_URL", "http://localhost:6910/listen-eng")
STT_API_URL_KIN = os.getenv("STT_API_URL_KIN", "http://localhost:6910/listen-kin")
STT_CONNECTION_RETRY = int(os.getenv("STT_CONNECTION_RETRY", 2))
STT_CONNECTION_TIMEOUT = int(os.getenv("STT_CONNECTION_TIMEOUT", 15))  # seconds

log_levels = {'error': logging.ERROR, 'debug': logging.DEBUG, 'info': logging.INFO}
APP_LOG_LEVEL = log_levels[os.environ.get('APP_LOG_LEVEL').lower()] \
    if (os.environ.get('APP_LOG_LEVEL') and os.environ.get('APP_LOG_LEVEL').lower() in log_levels) \
    else logging.INFO
os.environ['PYTHONASYNCIODEBUG'] = str(APP_LOG_LEVEL == logging.DEBUG)

APP_AUDIO_FILES_PATH = os.getenv("APP_AUDIO_FILES_PATH", "/var/lib/asterisk/sounds")  # mount path from asterisk sounds
APP_AUDIO_FORMAT = os.getenv("APP_AUDIO_FORMAT", "wav")  # STT & rasterisk: (core show file formats) must implement it
APP_AUDIO_SILENCE = os.getenv("APP_AUDIO_SILENCE", "3")  # stop recording after APP_AUDIO_SILENCE seconds of silence
APP_AUDIO_TIMEOUT = os.getenv("APP_AUDIO_TIMEOUT", "10000")  # stop recording after APP_AUDIO_TIMEOUT milliseconds
