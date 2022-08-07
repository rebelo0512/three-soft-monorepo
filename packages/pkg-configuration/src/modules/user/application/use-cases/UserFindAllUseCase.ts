import { BaseUseCase } from '@three-soft/core-backend';
import { IUserRepository, UserDto } from '../../domain';

export class UserFindAllUseCase extends BaseUseCase<void, UserDto[]> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(): Promise<UserDto[]> {
    return this.repository.findAll();
  }
}
