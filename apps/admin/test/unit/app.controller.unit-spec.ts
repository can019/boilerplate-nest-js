import { AppController } from '@api/src/app.controller';
import { AppModule } from '@admin/src/app.module';
import { AppService } from '@admin/src/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('AppController', () => {
  let appController: AppController;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService, { provide: WINSTON_MODULE_NEST_PROVIDER, useValue: { log: jest.fn() } }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
