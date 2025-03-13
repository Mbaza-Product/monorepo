import logging
import os

log_levels = {'error': logging.ERROR, 'debug': logging.DEBUG, 'info': logging.INFO}
APP_LOG_LEVEL = log_levels[os.environ.get('APP_LOG_LEVEL').lower()] \
    if (os.environ.get('APP_LOG_LEVEL') and os.environ.get('APP_LOG_LEVEL').lower() in log_levels) \
    else logging.INFO
APP_PORT = os.environ.get('SRV_PORT') or "6910"
