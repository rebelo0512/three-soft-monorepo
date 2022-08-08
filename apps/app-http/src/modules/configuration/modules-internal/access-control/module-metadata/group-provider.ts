import {
  GroupFindAllUseCase,
  GroupUpdateUseCase,
  GroupSearchUseCase,
  GroupMysqlRepository,
  IGroupRepository,
  GroupCreateUseCase,
  IPermissionRepository
} from '@three-soft/pkg-configuration';

export const group_use_cases_provider = [
  {
    provide: GroupFindAllUseCase.name,
    useFactory: (repository: IGroupRepository) => new GroupFindAllUseCase(repository),
    inject: [IGroupRepository.name]
  },
  {
    provide: GroupSearchUseCase.name,
    useFactory: (repository: IGroupRepository) => new GroupSearchUseCase(repository),
    inject: [IGroupRepository.name]
  },
  {
    provide: GroupCreateUseCase.name,
    useFactory: (repository: IGroupRepository) => new GroupCreateUseCase(repository),
    inject: [IGroupRepository.name]
  },
  {
    provide: GroupUpdateUseCase.name,
    useFactory: (repository: IGroupRepository, permissionRepository: IPermissionRepository) =>
      new GroupUpdateUseCase(repository, permissionRepository),
    inject: [IGroupRepository.name, IPermissionRepository.name]
  }
];

export const group_repositories_provider = [
  {
    provide: IGroupRepository.name,
    useClass: GroupMysqlRepository
  }
];
