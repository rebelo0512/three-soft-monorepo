import { ICityRepository } from '@three-soft/pkg-configuration';
import {
  PopCreateUseCase,
  PopFindAllUseCase,
  PopFindByIdUseCase,
  PopMysqlRepository,
  PopUpdateUseCase,
  IPopRepository,
  PopSearchUseCase
} from '@three-soft/pkg-fiber';
import { city_repositories_provider } from '../../../../../../configuration';

export const pop_use_cases_provider = [
  {
    provide: PopFindAllUseCase.name,
    useFactory: (repository: IPopRepository) => new PopFindAllUseCase(repository),
    inject: [IPopRepository.name]
  },
  {
    provide: PopSearchUseCase.name,
    useFactory: (repository: IPopRepository) => new PopSearchUseCase(repository),
    inject: [IPopRepository.name]
  },
  {
    provide: PopFindByIdUseCase.name,
    useFactory: (repository: IPopRepository) => new PopFindByIdUseCase(repository),
    inject: [IPopRepository.name]
  },
  {
    provide: PopCreateUseCase.name,
    useFactory: (repository: IPopRepository, cityRepository: ICityRepository) =>
      new PopCreateUseCase(repository, cityRepository),
    inject: [IPopRepository.name, ICityRepository.name]
  },
  {
    provide: PopUpdateUseCase.name,
    useFactory: (repository: IPopRepository) => new PopUpdateUseCase(repository),
    inject: [IPopRepository.name]
  }
];

export const pop_repositories_provider = [
  ...city_repositories_provider,
  {
    provide: IPopRepository.name,
    useClass: PopMysqlRepository
  }
];
