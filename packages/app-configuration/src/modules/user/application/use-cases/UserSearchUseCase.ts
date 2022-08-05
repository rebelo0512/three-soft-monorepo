import { BaseUseCase } from '@three-soft/core-backend';
import { UserDto } from '../../domain/dtos/UserDto';
import { IUserRepository, UserSearchInputDto } from '../../domain';

export class UserSearchUseCase extends BaseUseCase<UserSearchInputDto, UserDto[]> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(input: UserSearchInputDto): Promise<UserDto[]> {
    return this.repository.search(input);
  }
}
