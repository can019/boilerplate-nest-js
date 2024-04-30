import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmLogger } from '@libs/typeorm/utils/logger/typeorm-logger';
import dotenv from 'dotenv';
import { DataSourceOptions } from 'typeorm';

export function getOrmDynamicModule(connectionName?: string, entities?: string) {
  if (!entities) entities = path.join(__dirname, 'domain/**/*.entity{.ts,.js}');

  return TypeOrmModule.forRootAsync({
    name: connectionName,
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host:
        process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test'
          ? process.env.USE_NODE_DOCKER === 'yes'
            ? configService.get('DB_HOST')
            : 'localhost'
          : configService.get('DB_HOST'),
      port: +configService.get('DB_PORT'),
      username: configService.get('DB_USER'),
      password: configService.get('DB_PASSWORD'),
      database: configService.get('DB_DATABASE'),
      synchronize: process.env.NODE_ENV === 'production' ? true : true, // production인 경우 False

      logger: new TypeOrmLogger(),
      entities: [
        // production 모드일 경우 dist/typeorm/entity 에 있는 js 파일을 사용
        entities,
      ],
      migrations: ['dist/src/migration/**/*{.ts,.js}'],
    }),
    inject: [ConfigService],
  });
}

export function defaultOrmConfig(): DataSourceOptions {
  const entityPath = path.join(__dirname, 'domain/**/*.entity{.ts,.js}');
  dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env.prodction' : '.env.local' });
  return {
    type: 'postgres',
    host:
      process.env.NODE_ENV === 'local' || process.env.NODE_ENV === 'test'
        ? process.env.USE_NODE_DOCKER === 'yes'
          ? process.env.DB_HOST
          : 'localhost'
        : process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.NODE_ENV === 'production' ? true : true, // production인 경우 False

    // logger: new TypeOrmLogger(),
    entities: [
      // production 모드일 경우 dist/typeorm/entity 에 있는 js 파일을 사용
      entityPath,
    ],
    migrations: ['dist/src/migration/**/*{.ts,.js}'],
  };
}
