import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { defaultOrmConfig } from '@libs/typeorm/ormconfig';
import UserSeeder from './user.seeder';
import userFactory from '../factory/user.factory';

const options: DataSourceOptions & SeederOptions = {
  ...defaultOrmConfig(),
  logging: process.env.TEST === 'enabled' ? false : true,

  seeds: [UserSeeder],
  factories: [userFactory],
};

export const dataSourceForSeeding = new DataSource(options);
