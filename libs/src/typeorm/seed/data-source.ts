import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { setOrmConfig } from '../ormconfig';
import UserSeeder from './user.seeder';
import userFactory from '../factory/user.factory';

config({ path: '.env.local' });
const configService = new ConfigService({ app: { env: 'test' } });

const options: DataSourceOptions & SeederOptions = {
  ...(setOrmConfig(configService) as DataSourceOptions),
  logging: process.env.TEST === 'enabled' ? false : true,

  seeds: [UserSeeder],
  factories: [userFactory],
};

export default new DataSource(options);
