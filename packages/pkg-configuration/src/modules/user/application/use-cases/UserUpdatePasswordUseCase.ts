import { BaseUseCase, EntityNotFoundError, validateSchema, hashString } from '@three-soft/core-backend';
import { UserUpdatePasswordValidationSchema } from '../validators';
import { UserDto, IUserRepository, UserUpdatePasswordInputDto } from '../../domain';

export class UserUpdatePasswordUseCase extends BaseUseCase<UserUpdatePasswordInputDto, UserDto> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(input: UserUpdatePasswordInputDto): Promise<UserDto> {
    const dto = await validateSchema<UserUpdatePasswordInputDto>(UserUpdatePasswordValidationSchema, input);

    const user = await this.getUser(dto);

    const password_hashed = await hashString(input.password);

    return this.repository.updatePassword({
      id: user.user_id,
      password: password_hashed
    });
  }

  private async getUser(dto: UserUpdatePasswordInputDto) {
    const user = await this.repository.findById(dto.id);

    if (!user) throw new EntityNotFoundError('Usuário', dto.id, 'id');

    return user;
  }
}
