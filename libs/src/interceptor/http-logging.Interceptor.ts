import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from 'winston';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context.getArgByIndex(0);

    const now = Date.now();

    this.logger.http(`Request from ${method} ${url}`);

    return next.handle().pipe(
      tap({
        next: () => this.logger.http(`Response to ${method} ${url} in ${Date.now() - now}ms\n`),
        error: () => this.logger.http(`Error response to ${method} ${url} in ${Date.now() - now}ms\n`),
      }),
    );
  }
}
