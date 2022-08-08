import {
  PermissionMysqlRepository,
  IPermissionRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository,
  PermissionCreateUseCase,
  PermissionFindAllByDomainNameUseCase,
  PermissionFindAllByGroupIdUseCase,
  IGroupRepository,
  PermissionFindAllBySubDomainUseCase,
  PermissionFindAllDomainsBySystemNameUseCase,
  PermissionFindAllSystemsUseCase
} from '@three-soft/pkg-configuration';

export const permission_use_cases_provider = [
  {
    provide: PermissionCreateUseCase.name,
    useFactory: (repository: IPermissionRepository, domainRepository: IPermissionDomainRepository) =>
      new PermissionCreateUseCase(repository, domainRepository),
    inject: [IPermissionRepository.name, IPermissionDomainRepository.name]
  },
  {
    provide: PermissionFindAllByDomainNameUseCase.name,
    useFactory: (repository: IPermissionRepository, domainRepository: IPermissionDomainRepository) =>
      new PermissionFindAllByDomainNameUseCase(repository, domainRepository),
    inject: [IPermissionRepository.name, IPermissionDomainRepository.name]
  },
  {
    provide: PermissionFindAllByGroupIdUseCase.name,
    useFactory: (repository: IPermissionRepository, groupRepository: IGroupRepository) =>
      new PermissionFindAllByGroupIdUseCase(repository, groupRepository),
    inject: [IPermissionRepository.name, IGroupRepository.name]
  },
  {
    provide: PermissionFindAllBySubDomainUseCase.name,
    useFactory: (repository: IPermissionRepository) => new PermissionFindAllBySubDomainUseCase(repository),
    inject: [IPermissionRepository.name]
  },
  {
    provide: PermissionFindAllDomainsBySystemNameUseCase.name,
    useFactory: (domainRepository: IPermissionDomainRepository) =>
      new PermissionFindAllDomainsBySystemNameUseCase(domainRepository),
    inject: [IPermissionDomainRepository.name]
  },
  {
    provide: PermissionFindAllSystemsUseCase.name,
    useFactory: (domainRepository: IPermissionDomainRepository) =>
      new PermissionFindAllSystemsUseCase(domainRepository),
    inject: [IPermissionDomainRepository.name]
  }
];

export const permission_repositories_provider = [
  {
    provide: IPermissionRepository.name,
    useClass: PermissionMysqlRepository
  },
  {
    provide: IPermissionDomainRepository.name,
    useClass: PermissionDomainMysqlRepository
  }
];
