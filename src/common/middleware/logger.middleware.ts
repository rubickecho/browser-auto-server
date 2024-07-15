import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import dayjs from 'dayjs';
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
      format.timestamp(),
      format.printf(({ level, message, timestamp }) => {
        return `[${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')}] ${JSON.stringify(message)}`;
      }),
    ),
    transports: [
      new DailyRotateFile({
        filename: 'logs/%DATE%_error.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
      }),
      new DailyRotateFile({
        filename: 'logs/%DATE%_info.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
      }),
      new DailyRotateFile({
        filename: 'logs/%DATE%_debug.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'debug',
      }),
    ],
  });
  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const logData = {
        timestamp: new Date().toISOString(),
        ip,
        method,
        url,
        userAgent,
        statusCode,
        contentLength,
        request: {
          body: request.body,
          query: request.query,
          params: request.params,
        },
        response: {
          data: response.locals.data
        }
      };

      if (statusCode >= 500 || (statusCode >= 400)) {
        this.logger.error(logData);
      }

      if (this.logger.level === 'debug') {
        this.logger.debug(logData);
        return next();
      } else if (this.logger.level === 'info') {
        this.logger.info({ ...logData, request: undefined, response: undefined });
      }
    });

    next();
  }
}
