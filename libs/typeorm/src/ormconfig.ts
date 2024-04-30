import * as path from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export function setOrmConfig(configService: ConfigService, entities?: string) {
  if (!entities) entities = path.join(__dirname, 'domain/**/*.entity{.ts,.js}');
  return {
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

    entities: [entities],
    migrations: ['dist/src/migration/**/*{.ts,.js}'],
  } as TypeOrmModuleOptions;
}
