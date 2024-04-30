import { utilities } from 'nest-winston';
import { Logger, QueryRunner } from 'typeorm';
import { createLogger, Logger as WinstonLogger, transports, format } from 'winston';

export class TypeOrmLogger implements Logger {
  readonly #queryLogger: WinstonLogger;
  readonly #schemaLogger: WinstonLogger;
  readonly #slowQueryLogger: WinstonLogger;
  readonly #migreateLogger: WinstonLogger;
  readonly #queryErrorLogger: WinstonLogger;
  readonly #generalLogger: WinstonLogger;

  constructor() {
    const options = (filename: string) => ({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.simple(),
        utilities.format.nestLike('TYPEORM', { prettyPrint: true, colors: true }),
      ),
      transports: [
        new transports.Console({
          level: this.getLoggingLevel(),
          format: format.combine(
            format.timestamp(),
            format.splat(),
            format.json(),
            utilities.format.nestLike('TYPEORM', { prettyPrint: true, colors: true }),
          ),
        }),
        new transports.DailyRotateFile({
          dirname: 'logs/database',
          filename: `%DATE%.${filename}.log`,
          datePattern: 'YYYY-MM-DD',
          maxFiles: '30d',
          zippedArchive: true,
        }),
      ],
    });
    this.#queryLogger = createLogger(options('query'));
    this.#schemaLogger = createLogger(options('schema'));
    this.#slowQueryLogger = createLogger(options('slow'));
    this.#migreateLogger = createLogger(options('migrate'));
    this.#queryErrorLogger = createLogger(options('query.error'));
    this.#generalLogger = createLogger(options('general'));
  }
  getLoggingLevel() {
    if (process.env.TEST) return 'warn';
    if (process.env.NODE_ENV === 'production') return 'info';
    return 'silly';
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.#queryLogger.log({
      level: 'debug',
      message: `${query} - ${JSON.stringify(parameters)}`,
      timestamp: Date.now(),
      label: 'query',
    });
  }

  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.#queryErrorLogger.log({
      level: 'error',
      message: `${query} - ${JSON.stringify(parameters)} ${error}`,
      timestamp: Date.now(),
      label: 'error',
    });
  }

  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    this.#slowQueryLogger.log({
      level: 'warn',
      message: `${time} - ${query} - ${JSON.stringify(parameters)}`,
      timestamp: Date.now(),
      label: 'slow',
    });
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.#schemaLogger.log({
      level: 'info',
      message,
      timestamp: Date.now(),
      label: 'schema',
    });
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.#migreateLogger.log({
      level: 'info',
      message,
      timestamp: Date.now(),
      label: 'migrate',
    });
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    try {
      this.#generalLogger.log({
        level: 'info',
        message,
        timestamp: Date.now(),
        label: 'general',
      });
    } catch (e) {}
  }
}
