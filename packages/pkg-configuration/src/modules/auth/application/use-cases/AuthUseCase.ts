import {
  BaseUseCase,
  encodeToken,
  hashComparedString,
  validateSchema,
  AuthenticateError
} from '@three-soft/core-backend';
import { AuthValidationSchema } from '../validators';
import { IUserRepository, UserDto } from '../../..';
import { AuthInputDto, AuthOutputDto } from '../../domain';

export class AuthUseCase extends BaseUseCase<AuthInputDto, AuthOutputDto> {
  constructor(private repository: IUserRepository) {
    super();
  }

  async execute(input: AuthInputDto): Promise<AuthOutputDto> {
    const dto = await validateSchema<AuthInputDto>(AuthValidationSchema, input);

    const user = await this.getUser(dto);
    await this.validatePassword(dto, user);

    const token = encodeToken({ group_id: user.group_id, user_id: user.user_id });

    await this.repository.updateLastToken({ id: user.user_id, token });

    return {
      token,
      user: {
        user_id: user.user_id,
        user_name: this.formatUserName(user.user_name),
        queues: []
      }
    };
  }

  private async getUser(dto: AuthInputDto) {
    const user = await this.repository.findByEmailOrName({
      email: dto.email,
      name: null
    });

    if (!user) throw new AuthenticateError('prop_wrong');

    if (!user.user_status) throw new AuthenticateError('inactive');

    return user;
  }

  private async validatePassword(dto: AuthInputDto, user: UserDto) {
    const passwordCheckIsEqual = await hashComparedString(user.user_password, dto.password);

    if (!passwordCheckIsEqual) throw new AuthenticateError('prop_wrong');
  }

  private formatUserName(user_name: string) {
    return user_name.split(' ')[0];
  }
}
