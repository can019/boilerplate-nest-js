import { User } from '@libs/typeorm/domain/user/user.entity';
import { CustomRepository } from '@libs/typeorm/utils/repository/typeorm-custom-repository.decorator';
import { Repository } from 'typeorm';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
