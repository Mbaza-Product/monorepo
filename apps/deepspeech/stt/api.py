from fastapi import FastAPI, File
from fastapi.responses import JSONResponse
from transcribe import Transcriber
from utils.logger import Logger  # Use new Logger class
from utils.setup_db import setup_database
from fastapi.middleware.cors import CORSMiddleware

# FastAPI instance
api = FastAPI(
    title="Speech to Text API",
    summary="A simple API that transcribes speech to text",
    version="1.0.1",
    contact={
        "name": "Arnaud Kayonga",
        "url": "https://www.kayarn.co",
        "email": "arnauldkayonga1@gmail.com",
    },
    license_info={"name": "GNU GENERAL PUBLIC LICENSE"},
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=['*']
)

@api.on_event("startup")
async def on_startup():
    await setup_database()

@api.post("/transcribe", tags=["Speech to Text", "Transcribe", "Speech Recognition", "STT"])
async def transcribe_speech(audio_bytes: bytes = File(...)) -> JSONResponse:
    """Endpoint to transcribe speech from audio bytes."""
    
    log = Logger(service="stt")

    # try:
    # Perform transcription
    speech = Transcriber(audio_bytes)

    # Update log
    log.update(
        total_words=len(speech.transcription.split(" ")),
        total_char=len(speech.transcription),
        text=speech.transcription,
        audio_size=len(audio_bytes),
    )

    # Commit log to DB
    await log.commit_to_db()

    return JSONResponse(
        status_code=200,
        content={
            "text": speech.transcription,
            "stats": log.getData()
        },
    )

    # except Exception as e:
    #     log.update(error=str(e))
    #     await log.commit_to_db()  # Log the error too

    #     return JSONResponse(
    #         status_code=500,
    #         content={
    #             "error": "Sorry, we could not transcribe your audio. Please try again.",
    #             "details": str(e),
    #             "stats": log.getData(),
    #         },
    #     )

    


# #WebSocket Section

# # @api.websocket("/ws/transcribe")
# # async def websocket_endpoint(websocket: WebSocket):
# #     await websocket.accept()
# #     while True:
# #         audio_bytes = await websocket.receive_json(AudioBytes)
# #         # Process the received audio bytes here
# #         # Example: write the audio bytes to a file
# #         with open("audio.wav", "ab") as f:
# #             f.write(audio_bytes.data)


