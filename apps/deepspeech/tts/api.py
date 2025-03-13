from io import BytesIO
from fastapi import FastAPI
from fastapi.responses import FileResponse, StreamingResponse, JSONResponse
from pydantic import BaseModel
from generator import Generator
from utils.logger import Logger  # Use new Logger class
from utils.setup_db import setup_database
from fastapi.middleware.cors import CORSMiddleware

# FastAPI instance
api = FastAPI(
    title="Text to Speech API",
    summary="A simple API that transcribes text to speech",
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
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@api.on_event("startup")
async def on_startup():
    await setup_database()

class Text(BaseModel):
    text: str

@api.post("/generate", tags=["Text to Speech", "TTS"])
async def tts(text: Text):
    """
    Generate an audio file from the given text using a text-to-speech model.
    """
    log = Logger(service="tts")

    try:
        # Extract the text
        sentence = text.text

        # Generate the audio
        audio = Generator(text=sentence)

        # Update log
        log.update(total_words=len(sentence.split()), text=sentence)

        print(audio.response)

        # Commit log to DB
        await log.commit_to_db()

        # Return the generated audio file
        return StreamingResponse(
            audio.audio_buffer, media_type="audio/wav"
        )

    except Exception as e:
        log.update(error=str(e))
        await log.commit_to_db()  # Log the error too

        return JSONResponse(
            status_code=500,
            content={
                "error": "Sorry, we could not generate audio from your text. Please try again.",
                "details": str(e),
                "stats": log.getJson(),
            },
        )


# # @api.websocket("/ws/generate")
# # async def websocket_endpoint(websocket: WebSocket):
# #     """
# #     This function creates a WebSocket endpoint that accepts JSON messages containing a "text" field.
# #     If the length of the "text" field exceeds 50 characters, it sends a message back to the client indicating that the data is too large.
# #     Otherwise, it sends back the message text.
# #     """
# #     await websocket.accept()
# #     while True:
# #         try:
# #             data = await websocket.receive_json()
# #         except websocket.WebSocketDisconnect:
# #             break
# #         text = data.get("text", "")
# #         if len(text) > 50:
# #             await websocket.send_text("Data exceeds specified limit of 50 characters.")
# #         else:
# #             await websocket.send_text(f"Message text was: {text}")
