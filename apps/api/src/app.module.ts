import { Module } from '@nestjs/common';
import { AppController } from '@api/src/app.controller';
import { AppService } from '@api/src/app.service';
import { LoggerModule } from '@libs/utils/logger/logger.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmLogger } from '@libs/typeorm/utils/logger/typeorm-logger';
import { TypeOrmModule } from '@nestjs/typeorm';
import { setOrmConfig } from '@libs/typeorm/ormconfig';
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
    TypeOrmModule.forRootAsync({
      // name: connectionName,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return { ...setOrmConfig(configService), logger: new TypeOrmLogger() };
      },
      inject: [ConfigService],
    }),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
