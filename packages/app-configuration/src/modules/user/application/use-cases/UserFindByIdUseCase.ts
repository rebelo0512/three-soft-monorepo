import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IUserRepository, UserDto, UserFindByIdInputDto } from '../../domain';

export class UserFindByIdUseCase extends BaseUseCase<UserFindByIdInputDto, UserDto> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(input: UserFindByIdInputDto): Promise<UserDto> {
    const user = await this.repository.findById(input.id);

    if (!user) throw new EntityNotFoundError('Usuário', input.id, 'id');

    return user;
  }
}
