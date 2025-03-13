import settings
import sys
import logging
import asyncio
from utils import rasa_exec, tts_exec
import pyaudio
import uuid

sender_id = str(uuid.uuid1().node)

logger = logging.getLogger("orchestrator")
logger.setLevel(settings.APP_LOG_LEVEL)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('[%(levelname)s] [' + sender_id + '] [%(asctime)s]  %(message)s'))
    logger.addHandler(handler)


async def main():
    p = pyaudio.PyAudio()
    stream = p.open(format=p.get_format_from_width(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16)),
                    channels=1,
                    rate=22050,
                    output=True)
    try:
        while True:
            input_str = sys.stdin.readline().strip()
            if input_str != '':

                # 1. Call chatbot
                data = await rasa_exec(input_str, sender_id)
                for json in data:
                    text = json['text']
                    logger.info("< " + text)

                    # 2. Call TTS
                    audio = await tts_exec(text)
                    logger.debug('TTS <- audio({} Kbytes)'.format(len(audio)/1000))

                    # 3. Playback
                    logger.debug('playback start')
                    stream.write(audio)
                    logger.debug('playback end')
    except KeyboardInterrupt:
        stream.stop_stream()
        stream.close()
        p.terminate()
        logger.info('Goodby!')


if __name__ == "__main__":
    logger.info('Type your question:')
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
