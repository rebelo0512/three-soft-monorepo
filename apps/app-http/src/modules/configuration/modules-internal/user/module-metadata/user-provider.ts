import {
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserCreateUseCase,
  UserFindAllUseCase,
  UserFindByIdUseCase,
  UserMyInformationUseCase,
  UserMysqlRepository,
  UserSearchUseCase,
  UserUpdatePasswordUseCase,
  UserUpdateUseCase
} from '@three-soft/pkg-configuration';
import { company_repositories_provider } from '../../company';
import { group_repositories_provider } from '../../access-control/module-metadata';

export const user_use_cases_provider = [
  {
    provide: UserCreateUseCase.name,
    useFactory: (
      repository: IUserRepository,
      groupRepository: IGroupRepository,
      companyRepository: ICompanyRepository
    ) => new UserCreateUseCase(repository, groupRepository, companyRepository),
    inject: [IUserRepository.name, IGroupRepository.name, ICompanyRepository.name]
  },
  {
    provide: UserFindAllUseCase.name,
    useFactory: (repository: IUserRepository) => new UserFindAllUseCase(repository),
    inject: [IUserRepository.name]
  },
  {
    provide: UserFindByIdUseCase.name,
    useFactory: (repository: IUserRepository) => new UserFindByIdUseCase(repository),
    inject: [IUserRepository.name]
  },
  {
    provide: UserMyInformationUseCase.name,
    useFactory: (repository: IUserRepository) => new UserMyInformationUseCase(repository),
    inject: [IUserRepository.name]
  },
  {
    provide: UserSearchUseCase.name,
    useFactory: (repository: IUserRepository) => new UserSearchUseCase(repository),
    inject: [IUserRepository.name]
  },
  {
    provide: UserUpdateUseCase.name,
    useFactory: (repository: IUserRepository, groupRepository: IGroupRepository) =>
      new UserUpdateUseCase(repository, groupRepository),
    inject: [IUserRepository.name, IGroupRepository.name]
  },
  {
    provide: UserUpdatePasswordUseCase.name,
    useFactory: (repository: IUserRepository) => new UserUpdatePasswordUseCase(repository),
    inject: [IUserRepository.name]
  }
];

export const user_repositories_provider = [
  ...group_repositories_provider,
  ...company_repositories_provider,
  {
    provide: IUserRepository.name,
    useClass: UserMysqlRepository
  }
];
