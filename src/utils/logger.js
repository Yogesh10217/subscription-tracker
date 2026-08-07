const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

const currentLevel = process.env.LOG_LEVEL || 'info';

function formatMessage(level, message, meta = {}, requestId = null) {
  const timestamp = new Date().toISOString();
  const reqIdStr = requestId ? ` [ReqID: ${requestId}]` : '';
  const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]${reqIdStr}: ${message}${metaStr}`;
}

export const logger = {
  info(message, meta = {}, requestId = null) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.info) {
      console.log(formatMessage('info', message, meta, requestId));
    }
  },

  warn(message, meta = {}, requestId = null) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.warn) {
      console.warn(formatMessage('warn', message, meta, requestId));
    }
  },

  error(message, meta = {}, requestId = null) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.error) {
      console.error(formatMessage('error', message, meta, requestId));
    }
  },

  debug(message, meta = {}, requestId = null) {
    if (LOG_LEVELS[currentLevel] >= LOG_LEVELS.debug) {
      console.debug(formatMessage('debug', message, meta, requestId));
    }
  }
};

export default logger;
