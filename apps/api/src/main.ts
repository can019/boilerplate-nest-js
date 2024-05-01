import { NestFactory } from '@nestjs/core';
import { AppModule } from '@api/src/app.module';
import { WINSTON_MODULE_NEST_PROVIDER, WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoggingInterceptor } from '@libs/interceptor/http-logging.Interceptor';
import { GlobalExceptionFilter } from '@libs/filter/global-exception.filter';
import rateLimit from 'express-rate-limit';
import { rateLimitOption } from './config/secure/rate-limit.config';
import { corsOption } from './config/secure/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true, // false로 바꿀 경우 bootstrap시 로그는 winston이 아닌 nest 자체 로그 사용.
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(WINSTON_MODULE_PROVIDER)));
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(WINSTON_MODULE_NEST_PROVIDER))); // 전역 필터 적

  app.enableCors(corsOption);
  app.use(rateLimit(rateLimitOption)); //호출 제한

  app.setGlobalPrefix('api');
  await app.listen(3000);
}

bootstrap();
