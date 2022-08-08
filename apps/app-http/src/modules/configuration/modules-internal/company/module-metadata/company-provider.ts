import {
  CompanyCreateUseCase,
  CompanyFindAllUseCase,
  CompanyFindByIdUseCase,
  CompanyMysqlRepository,
  CompanyUpdateUseCase,
  ICompanyRepository
} from '@three-soft/pkg-configuration';

export const company_use_cases_provider = [
  {
    provide: CompanyFindAllUseCase.name,
    useFactory: (repository: ICompanyRepository) => new CompanyFindAllUseCase(repository),
    inject: [ICompanyRepository.name]
  },
  {
    provide: CompanyFindByIdUseCase.name,
    useFactory: (repository: ICompanyRepository) => new CompanyFindByIdUseCase(repository),
    inject: [ICompanyRepository.name]
  },
  {
    provide: CompanyCreateUseCase.name,
    useFactory: (repository: ICompanyRepository) => new CompanyCreateUseCase(repository),
    inject: [ICompanyRepository.name]
  },
  {
    provide: CompanyUpdateUseCase.name,
    useFactory: (repository: ICompanyRepository) => new CompanyUpdateUseCase(repository),
    inject: [ICompanyRepository.name]
  }
];

export const company_repositories_provider = [
  {
    provide: ICompanyRepository.name,
    useClass: CompanyMysqlRepository
  }
];
