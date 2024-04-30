import { Module } from '@nestjs/common';
import { AppController } from '@api/src/app.controller';
import { AppService } from '@api/src/app.service';
import { LoggerModule } from '@libs/utils/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { getOrmDynamicModule } from '@libs/typeorm/ormconfig';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용하기 위해
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.local',
    }),
    getOrmDynamicModule(),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
