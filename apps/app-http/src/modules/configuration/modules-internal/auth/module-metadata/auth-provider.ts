import { IUserRepository, AuthUseCase } from '@three-soft/pkg-configuration';
import { user_repositories_provider } from '../../user';

export const auth_use_cases_provider = [
  {
    provide: AuthUseCase.name,
    useFactory: (repository: IUserRepository) => new AuthUseCase(repository),
    inject: [IUserRepository.name]
  }
];

export const auth_repositories_provider = [...user_repositories_provider];
