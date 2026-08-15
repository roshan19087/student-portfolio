import pino from 'pino';
import { env } from '../config/env.config.js';

export const logger = pino({
  level: env.NODE_ENV === 'test' ? 'silent' : env.NODE_ENV === 'development' ? 'debug' : 'info',
  transport:
    env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'tokenHash'],
    censor: '***REDACTED***',
  },
});
