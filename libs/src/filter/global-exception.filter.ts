import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CustomError } from '@libs/filter/custom-error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (!(exception instanceof HttpException) && !(exception instanceof CustomError)) {
      const internalServerException = new InternalServerErrorException();
      internalServerException.stack = exception.stack;
      exception = internalServerException;
      // push to slack or ...
    }

    const response = (exception as HttpException | CustomError).getResponse();

    const log = {
      timestamp: new Date(),
      url: req.url,
      response,
      stack: exception.stack,
      message: exception.name,
      pid: process.pid,
    };

    this.logger.error(log);

    res.status((exception as HttpException | CustomError).getStatus()).json(response);
  }
}
