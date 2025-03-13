import io
import os
import hashlib
import asyncio
from panoramisk import fast_agi
import logging
from orchestrator.app import settings
from orchestrator.app.utils import rasa_exec, tts_exec, asterisk_play, asterisk_record, stt_exec
import base64
from os import path as os_path
import wave
import audioop

logger = logging.getLogger("orchestrator")
logger.setLevel(settings.APP_LOG_LEVEL)
if not logger.hasHandlers():
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter('[%(levelname)s] [%(process)d-%(thread)d] [%(asctime)s] %(message)s'))
    logger.addHandler(handler)


async def irv(request):
    sender_id = request.headers['agi_callerid']
    lang = request.headers['agi_arg_1'] if 'agi_arg_1' in request.headers else 'eng'

    try:
        # 1. record
        input_filepath = await asterisk_record(request, sender_id)
        if input_filepath is False:
            return False

        # 2. call STT
        stt_resp = await stt_exec(filepath=input_filepath, lang=lang)
        if settings.APP_LOG_LEVEL is not logging.DEBUG:
            os.remove(input_filepath)
        if 'detail' in stt_resp:
            logger.error('[{}] STT <- Response error: {}'.format(sender_id, stt_resp['detail'][0]['msg']))
            return False

        for transcript in stt_resp:
            # 3. call rasa chatbot
            data = await rasa_exec(text=transcript, sender_id=sender_id, lang=lang)
            for itm in data:
                text = itm['text']
                logger.debug('[{}] chatbot <- {}'.format(sender_id, text))

                # 4. call TTS
                output_filename = 'fast_agi_output_' + base64.urlsafe_b64encode(hashlib.md5(bytes(text, 'utf-8')).digest())\
                    .decode('ascii').replace('=', '').replace('_', '')
                output_filepath = os_path.join(settings.APP_AUDIO_FILES_PATH, output_filename + '.wav')

                if os_path.exists(output_filepath) is False:
                    file_content = await tts_exec(text=text, lang=lang)
                    if len(file_content):
                        try:
                            logger.debug('[{}] TTS <- audio({} Kbytes): {}'.format(sender_id, len(file_content)/1000, output_filepath))
                            file_content = await wav_downsample(file_content)
                            fp = open(output_filepath, 'wb')
                            fp.write(file_content)
                            fp.close()
                        except Exception as e:
                            logger.error('[{}] TTS <- Error saving file {}: {}'.format(sender_id, output_filepath, str(e)))
                    else:
                        return True
                else:
                    logger.debug('[{}] TTS <- cached audio response: {}'.format(sender_id, output_filepath))

                # 5. playback
                await asterisk_play(request, sender_id, output_filename)

    except Exception as e:
        logger.error('Error before handup: {}'.format(str(e)))
        await request.send_command('GOSUB ivr-bye-{} s 1'.format(lang))

    return True


async def wav_downsample(content, to_rate: int = 8000):
    wi = wave.Wave_read(io.BytesIO(content))
    data = wi.readframes(wi.getnframes())

    try:
        converted = audioop.ratecv(data, 2, 1, 22050, to_rate, None)
    except Exception as e:
        logger.error('Could not convert wav to 8K sampling_rate: {}'.format(str(e)))
        raise Exception(e)

    out = io.BytesIO(bytes())
    try:
        wo = wave.Wave_write(out)
        wo.setparams((1, 2, to_rate, 0, 'NONE', 'Uncompressed'))
        wo.writeframes(converted[0])
        wo.close()
    except Exception as e:
        logger.error('Could not write 8k converted wav: {}'.format(str(e)))
        raise Exception(e)

    out.seek(0)
    return out.read()


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    fa_app = fast_agi.Application(loop=loop)
    fa_app.add_route('irv', irv)
    coro = asyncio.start_server(fa_app.handler, settings.SRV_HOST, settings.SRV_PORT, loop=loop)
    server = loop.run_until_complete(coro)

    # Serve requests until CTRL+c is pressed
    logger.info('Asterisk endpoint agi://{}:{}/irv'.format(settings.SRV_HOST, settings.SRV_PORT))
    logger.info('Ready!')
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass

    # Close the server
    server.close()
    loop.run_until_complete(server.wait_closed())
    loop.close()