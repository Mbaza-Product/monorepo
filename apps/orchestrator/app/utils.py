import requests
import settings
import logging
from os import path as os_path
import time

logger = logging.getLogger("orchestrator")
TTS_TOKEN = ''


async def tts_login(lang: str = 'eng'):
    api_url = {'eng': settings.TTS_API_URL, 'kin': settings.TTS_API_URL_KIN}
    api_username = {'eng': settings.TTS_API_USERNAME, 'kin': settings.TTS_API_USERNAME_KIN}
    api_password = {'eng': settings.TTS_API_PASSWORD, 'kin': settings.TTS_API_PASSWORD_KIN}

    try:
        resp = requests.post(api_url[lang] + "/token", data={
            "username": api_username[lang],
            "password": api_password[lang],
            "grant_type": "",
            "scope": "",
            "client_id": "",
            "client_secret": ""
        }, timeout=settings.TTS_CONNECTION_TIMEOUT)
        data = resp.json()
        logger.debug('TTS <- access_token = {}'.format(data['access_token']))

    except Exception as e:
        logger.error('TTS <- failed to login at {}'.format(api_url[lang]))
        raise Exception(e)

    return data['access_token']


async def rasa_exec(text: str, sender_id: str, lang: str = 'eng', retry: int = 0):
    logger.debug('chatbot -> "{}"'.format(text))
    api_url = {'eng': settings.RASA_API_URL, 'kin': settings.RASA_API_URL_KIN}

    try:
        resp = requests.post(api_url[lang],
                             json={'sender': sender_id, 'message': text},
                             timeout=settings.RASA_CONNECTION_TIMEOUT)
        if resp.status_code != 200:
            logger.error('chatbot <- invalid response {} {}'.format(resp.status_code, resp.reason))

    except Exception as e:
        logger.error('chatbot <- communication failed at > {}: {}'.format(api_url[lang], str(e)))
        if retry < settings.RASA_CONNECTION_RETRY:
            time.sleep(3)
            return await rasa_exec(text, sender_id, lang, retry + 1)
        else:
            raise Exception(e)

    return resp.json()


async def asterisk_play(agi_request, sender_id, output_filename):
    logger.debug('[{}] asterisk -> start playback')
    resp = (await agi_request.send_command('STREAM FILE ' + output_filename + ' "" 0'))
    if 'error' in resp:
        logger.error('[{}] asterisk <- {}: {}'.format(sender_id, resp['error'], resp['msg']))
        return False
    logger.debug('[{}] asterisk <- end playback')

    return True


async def asterisk_record(agi_request, sender_id):
    input_filename = 'fast_agi_input_' + str(sender_id)
    input_filepath = os_path.join(settings.APP_AUDIO_FILES_PATH, input_filename + '.' + settings.APP_AUDIO_FORMAT)

    logger.debug('[{}] asterisk start recording'.format(sender_id))
    resp = (await agi_request.send_command('RECORD FILE "' + input_filename
                                           + '" "' + settings.APP_AUDIO_FORMAT
                                           + '" "#" ' + settings.APP_AUDIO_TIMEOUT
                                           + ' 0 beep S=' + settings.APP_AUDIO_SILENCE))
    if 'error' in resp:
        logger.error('[{}] asterisk <- {}: {}'.format(sender_id, resp['error'], resp['msg']))
        return False

    if os_path.exists(input_filepath) is False:
        logger.error('[{}] asterisk ->'.format(sender_id)
                     + ' Recording is saved, but could not find it in APP_AUDIO_FILES_PATH {}'.format(input_filepath)
                     + ' Is asterisk drive mounted?')
        return False
    logger.debug('[{}] asterisk <- audio ({} kbytes)'.format(sender_id, os_path.getsize(input_filepath)))

    return input_filepath

async def tts_exec(text: str, lang: str = 'eng', retry: int = 0):
    if settings.USE_DEEPSPEECH:
        return await deepspeech_tts_exec(text, retry)
     
    global TTS_TOKEN
    logger.debug('TTS -> "{}"'.format(text))
    api_url = {'eng': settings.TTS_API_URL, 'kin': settings.TTS_API_URL_KIN}

    try:
        resp = requests.post(api_url[lang] + "/speak",
                             json={'text': '. ' + text + ' .'},
                             headers={'Authorization': 'Bearer ' + TTS_TOKEN},
                             timeout=settings.TTS_CONNECTION_TIMEOUT)
        if resp.status_code == 401 and retry < 2:
            logger.debug('TTS <- not authenticated, retry {}'.format(retry))
            TTS_TOKEN = await tts_login(lang)
            return await tts_exec(text=text, lang=lang, retry=retry + 1)

    except Exception as e:
        logger.error('TTS <- communication failed at {}, {}'.format(api_url[lang] + '/speak', str(e)))
        if retry < settings.TTS_CONNECTION_RETRY:
            time.sleep(3)
            return await tts_exec(text=text, lang=lang, retry=retry + 1)
        else:
            raise Exception(e)

    return resp.content


async def stt_exec(filepath: str, lang: str = 'eng', retry: int = 0):
    if settings.USE_DEEPSPEECH:
        return await deepspeech_stt_exec(filepath, retry)
     
    logger.debug('STT -> "{}"'.format(filepath))
    api_url = {'eng': settings.STT_API_URL, 'kin': settings.STT_API_URL_KIN}
    try:
        with open(filepath, 'rb') as fobj:
            resp = requests.post(api_url[lang], files={'content': fobj}, timeout=settings.STT_CONNECTION_TIMEOUT)

    except Exception as e:
        logger.error('STT <- communication failed at {}, {}'.format(api_url[lang], str(e)))
        if retry < settings.STT_CONNECTION_RETRY:
            time.sleep(3)
            return await stt_exec(filepath=filepath, lang=lang, retry=retry + 1)
        else:
            raise Exception(e)

    return resp.json()


async def deepspeech_tts_exec(text: str, lang: str = 'eng', retry: int = 0):
    logger.debug(f'DEEPSPEECH TTS -> "{text}"')
    api_url = {'eng': settings.TTS_API_URL, 'kin': settings.TTS_API_URL_KIN}
    try:
        resp = requests.post(api_url[lang],
                             json={'text': text},
                             timeout=settings.TTS_CONNECTION_TIMEOUT)
        if resp.status_code != 200 and retry < 2:
            logger.debug('TTS <- bad request, retry {}'.format(retry))
            return await deepspeech_tts_exec(text=text, lang=lang, retry=retry + 1)

    except Exception as e:
        logger.error(f'TTS <- communication failed: {str(e)}')
        if retry < settings.TTS_CONNECTION_RETRY:
            time.sleep(3)
            return await deepspeech_tts_exec(text=text, retry=retry + 1)
        else:
            raise Exception(e)


async def deepspeech_stt_exec(filepath: str, lang: str = 'eng', retry: int = 0):
    logger.debug(f'DEEPSPEECH STT -> "{filepath}"')
    api_url = {'eng': settings.STT_API_URL, 'kin': settings.STT_API_URL_KIN}
    try:
        with open(filepath, 'rb') as fobj:
            resp = requests.post(api_url[lang], files={'audio_bytes': fobj}, timeout=settings.STT_CONNECTION_TIMEOUT)
            logger.debug(str(resp.json()))
    except Exception as e:
        logger.error('STT <- communication failed at {}, {}'.format(api_url[lang], str(e)))
        if retry < settings.STT_CONNECTION_RETRY:
            time.sleep(3)
            return await stt_exec(filepath=filepath, lang=lang, retry=retry + 1)
        else:
            raise Exception(e)

    return resp.json()