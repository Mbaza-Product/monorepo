from __future__ import annotations
from fastapi import File, APIRouter, Request
from fastapi.responses import JSONResponse
import logging

router = APIRouter()
logger = logging.getLogger("stt")


@router.post("/listen-eng", response_class=JSONResponse)
async def listen_eng(request: Request, content: bytes = File(...)):
    logger.debug('Demo STT <- audio({} Kbytes)'.format(len(content) / 1000))
    return JSONResponse(await get_response(request, 'eng'))


@router.post("/listen-kin", response_class=JSONResponse)
async def listen_eng(request: Request, content: bytes = File(...)):
    logger.debug('Demo STT <- audio({} Kbytes)'.format(len(content) / 1000))
    return JSONResponse(await get_response(request, 'kin'))


async def get_response(request, lang: str):
    samples = request.app.samples[lang]

    if request.app.samples_index[lang] >= len(samples):
        request.app.samples_index[lang] = 0
    index = request.app.samples_index[lang]
    current_sample = samples[index]

    next_index = index+1
    if next_index >= len(samples):
        next_index = 0
    next_sample = samples[next_index]

    logger.debug('Demo STT -> {}'.format(current_sample))
    logger.debug('Demo STT (NEXT) -> {}'.format(next_sample))

    request.app.samples_index[lang] += 1
    return [current_sample]
