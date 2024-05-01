import { NestFactory } from '@nestjs/core';
import { AppModule } from '@api/src/app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggingInterceptor } from '@libs/interceptor/http-logging.Interceptor';
import { GlobalExceptionFilter } from '@libs/filter/global-exception.filter';
import rateLimit from 'express-rate-limit';
import { rateLimitOption } from '@api/src/config/secure/rate-limit.config';
import { corsOption } from '@api/src/config/secure/cors.config';
import express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // false로 바꿀 경우 bootstrap시 로그는 winston이 아닌 nest 자체 로그 사용.
  });

  /* Secure*/
  app.enableCors(corsOption);
  app.use(rateLimit(rateLimitOption)); //호출 제한
  /** */

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER)); // winston logger 설정

  /* Custom interceptor / pipe / guard / filter */
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(WINSTON_MODULE_PROVIDER))); // http 로깅 인터셉터
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER))); // 전역 필터 적
  /** */

  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
