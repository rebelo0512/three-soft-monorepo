import { BaseUseCase, decodeToken, EntityNotFoundError } from '@three-soft/core-backend';
import { IUserRepository, UserDto, UserMyInformationInputDto } from '../../domain';

export class UserMyInformationUseCase extends BaseUseCase<UserMyInformationInputDto, UserDto> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(input: UserMyInformationInputDto): Promise<UserDto> {
    const token_decoded = decodeToken(input.token);

    const user = await this.repository.findById(token_decoded.id);

    if (!user) throw new EntityNotFoundError('Usuário', token_decoded.id, 'id');

    return user;
  }
}
