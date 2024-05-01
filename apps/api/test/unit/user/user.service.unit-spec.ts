import { UserRepository } from '@api/src/user/user.repository';
import { UserService } from '@api/src/user/user.service';
import { DataSoureMock } from '@libs/typeorm/utils/test/mock.test-util';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';

describe('[UserService]', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: DataSource,
          useClass: DataSoureMock,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create()', () => {
    it('user create의 결과로 반환되는 User객체의 id는 주어진 id와 일치해야 한다. ', async () => {
      const a = '3';

      const spyFn = jest.spyOn(DataSoureMock.prototype, 'transaction');

      expect((await userService.create(a)).id).toBe(a);

      expect(spyFn).toBeCalled();
    });
  });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });
});
