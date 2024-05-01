import { UserRepository } from '@api/src/user/user.repository';
import { UserService } from '@api/src/user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { type DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('[UserService]', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let module: TestingModule;
  let dataSoure: DeepMockProxy<DataSource>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        {
          provide: DataSource,
          useValue: mockDeep<DataSource>(),
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('create()', () => {
    it('user create의 결과로 반환되는 User객체의 id는 주어진 id와 일치해야 한다. ', async () => {
      const a = '3';

      expect((await userService.create(a)).id).toBe(a);
    });
  });

  //   describe('delete()', () => {
  //     it('user delete시 transaction이 호출되어야 한다. ', async () => {
  //       const id = '3';

  //       expect(await userService.delete(id)).toBeInstanceOf(Promise<DeleteResult>);
  //     });
  //   });

  afterAll(async () => {
    if (module) {
      await module.close();
    }
  });
});
