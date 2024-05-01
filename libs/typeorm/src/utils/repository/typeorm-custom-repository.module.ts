import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TYPEORM_EX_CUSTOM_REPOSITORY } from './typeorm-custom-repository.decorator';

export class TypeOrmExModule {
  /**
   * 레포지토리에 entity가 아닌 repository를 넣어야 함.
   *   - entity를 넣어도 작동하지만 원래 의도는 repository를 넣는 것.
   *   - 해당 함수는 module을 return합니다. 따라서 import에 넣어주는 것이 맞음.
   *   - Module return시 repository를 export하고 있으므로 module import 후 provider에 repository를 넣지 않아도 됨.
   *     - Module, provider, export 개념이 헷갈린다면 https://greatlaboratory.dev/nestjs/nestjs-02/를 참조.
   *   - export 시 해당 모듈은 반드시 export해야함.
   * @param repositories repository. Not entity
   * @param connectionName connection name
   * @returns
   */
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
    connectionName?: string,
  ): DynamicModule {
    const providers: Provider[] = [];

    for (const repository of repositories) {
      const entity = Reflect.getMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, repository);

      if (!entity) {
        continue;
      }

      providers.push({
        inject: [getDataSourceToken(connectionName)], // 커넥션 이름을 넣어줘야 api와 admin에서 알아서 찾아감.
        provide: repository,
        useFactory: (dataSource: DataSource): typeof repository => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repository(baseRepository.target, baseRepository.manager, baseRepository.queryRunner);
        },
      });
    }

    return {
      exports: providers,
      module: TypeOrmExModule,
      providers,
    };
  }
}
