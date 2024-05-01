import { setSeederFactory } from 'typeorm-extension';
import { User } from '../domain/user/user.entity';

export default setSeederFactory(User, (faker) => {
  const user = new User();
  const email = faker.internet.email();
  user.id = email;

  return user;
});
