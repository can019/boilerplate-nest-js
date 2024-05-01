import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';
import { User } from '@libs/typeorm/domain/user/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userQueryRepository: UserRepository, private readonly dataSource: DataSource) {}
  public async create(id: string) {
    const user = new User();
    user.id = id;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      transactionalEntityManager.save(user);
    });
    return user;
  }
}
