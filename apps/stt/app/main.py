import logging
import pathlib
import os

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from stt.app import settings
from stt.app.routes import views

# set logging
logging.getLogger("uvicorn.error").disabled = True
logger = logging.getLogger("stt")
logger.setLevel(settings.APP_LOG_LEVEL)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('[%(asctime)s] [%(process)d-%(thread)d] [%(levelname)s] %(message)s'))
    logger.addHandler(handler)

# create app object
app = FastAPI(
    title="Mbaza Demo STT",
    description="Demo STT component for Mbaza Chatbot",
    version="1.0.0",
    debug=settings.APP_LOG_LEVEL is logging.DEBUG,
    openapi_url="/openapi.json",
    docs_url="/",
    redoc_url="/redoc",
)

# set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# initialize samples
samples = {'eng': 'sample_eng.txt', 'kin': 'sample_kin.txt'}
app.samples = {}
app.samples_index = {'eng': 0, 'kin': 0}
try:
    for lang in samples:
        filepath = os.path.join(pathlib.Path(__file__).parent.parent.resolve(), samples[lang])
        with open(filepath) as file:
            lines = file.readlines()
            app.samples[lang] = [line.rstrip() for line in lines]
except Exception as e:
    logger.error(str(e))

# add endpoints
app.include_router(views.router)

logger.info("Visit http://localhost:" + settings.APP_PORT + " for a list of possible operations.")
logger.info('Ready!')

# start server locally for development
if os.getenv("APP_LOCAL_RUN") in ["1", "true", "True", "TRUE"]:
    import uvicorn
    uvicorn.run(
        app, proxy_headers=True, forwarded_allow_ips="*", host="localhost", port=settings.APP_PORT
    )
