import { BaseUseCase, EntityNotFoundError, validateSchema, hashString } from '@three-soft/core-backend';
import { UserUpdateValidationSchema } from '../validators';
import { IGroupRepository } from '../../../access-control';
import { UserDto, UserUpdateInputDto, IUserRepository } from '../../domain';

export class UserUpdateUseCase extends BaseUseCase<UserUpdateInputDto, UserDto> {
  constructor(private repository: IUserRepository, private groupRepository: IGroupRepository) {
    super();
  }

  async execute(input: UserUpdateInputDto): Promise<UserDto> {
    const dto = await validateSchema<UserUpdateInputDto>(UserUpdateValidationSchema, input);

    const user = await this.getUser(dto);

    const group = await this.getGroup(dto);

    let password_hashed: string | null = null;
    if (input.password) {
      password_hashed = await hashString(input.password);
    }

    return this.repository.update({
      id: user.user_id,
      name: dto.name,
      email: dto.email,
      password: password_hashed,
      status: dto.status,
      group_id: group.group_id
    });
  }

  private async getUser(dto: UserUpdateInputDto) {
    const user = await this.repository.findById(dto.id);

    if (!user) throw new EntityNotFoundError('Usuário', dto.id, 'id');

    return user;
  }

  private async getGroup(dto: UserUpdateInputDto) {
    const group = await this.groupRepository.findByName(dto.group);

    if (!group) throw new EntityNotFoundError('Grupo', dto.group, 'nome');

    return group;
  }
}
