/* eslint-disable @typescript-eslint/ban-types */
import { DataSource, EntityManager, QueryRunner, createQueryBuilder } from 'typeorm';

/* eslint-disable @typescript-eslint/no-empty-function */
export class DataSoureMock {
  async transaction(): Promise<void> {}
}
export class EntityManagerMock {
  save() {}
  delete() {}
}

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
  createQueryRunner: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    manager: {
      save: jest.fn(),
      delete: jest.fn(),
    },
  })),
  manager: jest.fn()(() => ({
    save: jest.fn(),
    delete: jest.fn(),
  })),
  transaction: jest.fn(),
}));
