import {
  CityCreateUseCase,
  CityFindAllUseCase,
  CityFindByIdUseCase,
  CityMysqlRepository,
  CityUpdateUseCase,
  ICityRepository
} from '@three-soft/pkg-configuration';

export const city_use_cases_provider = [
  {
    provide: CityFindAllUseCase.name,
    useFactory: (repository: ICityRepository) => new CityFindAllUseCase(repository),
    inject: [ICityRepository.name]
  },
  {
    provide: CityFindByIdUseCase.name,
    useFactory: (repository: ICityRepository) => new CityFindByIdUseCase(repository),
    inject: [ICityRepository.name]
  },
  {
    provide: CityCreateUseCase.name,
    useFactory: (repository: ICityRepository) => new CityCreateUseCase(repository),
    inject: [ICityRepository.name]
  },
  {
    provide: CityUpdateUseCase.name,
    useFactory: (repository: ICityRepository) => new CityUpdateUseCase(repository),
    inject: [ICityRepository.name]
  }
];

export const city_repositories_provider = [
  {
    provide: ICityRepository.name,
    useClass: CityMysqlRepository
  }
];
