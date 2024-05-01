import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptionsFactory, utilities } from 'nest-winston';
import { LoggerOptions } from 'winston';
import 'winston-daily-rotate-file';
import * as winston from 'winston';

const { combine, timestamp } = winston.format;

@Injectable()
export class LoggerService implements WinstonModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  private getLevel(): string {
    if (process.env.TEST) return 'warn';

    if (process.env.NODE_ENV === 'development' || 'local') return 'silly';

    return 'verbose';
  }

  createWinstonModuleOptions(): LoggerOptions | Promise<LoggerOptions> {
    return {
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.simple(),
        utilities.format.nestLike('APP', { prettyPrint: true, colors: true }),
      ),
      transports: [
        this.normalFileTransport(),
        this.errorFileTransport(),
        new winston.transports.Console({
          level: this.getLevel(),
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.splat(),
            winston.format.json(),
            utilities.format.nestLike('APP', { prettyPrint: true, colors: true }),
          ),
        }),
      ],
    };
  }

  private normalFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: this.getLevel(),
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/app',
      filename: `%DATE%.log`,
      maxFiles: this.configService.get<string>('LOGGER_INFO_EXPIRE_DATE') || '30d',
      zippedArchive: true,
    });
  }
  //https://github.com/winstonjs/winston-daily-rotate-file/issues/250
  private errorFileTransport() {
    return new winston.transports.DailyRotateFile({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs/app/error',
      filename: `%DATE%.error.log`,
      maxFiles: this.configService.get<string>('LOGGER_ERROR_EXPIRE_DATE') || '90d',
      zippedArchive: true,
    });
  }
}
