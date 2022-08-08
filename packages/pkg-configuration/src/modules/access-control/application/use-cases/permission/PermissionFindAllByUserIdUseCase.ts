import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IPermissionRepository, PermissionDto, PermissionFindAllByUserIdInputDto } from '../../../domain';
import { IUserRepository } from '../../../../user';

export class PermissionFindAllByUserIdUseCase extends BaseUseCase<PermissionFindAllByUserIdInputDto, string[]> {
  constructor(private permissionRepository: IPermissionRepository, private userRepository: IUserRepository) {
    super();
  }

  async execute(input: PermissionFindAllByUserIdInputDto): Promise<string[]> {
    const user = await this.getUser(input);

    const permissions = await this.permissionRepository.findAllByGroupId(user.group_id);

    return this.formatPermission(permissions);
  }

  private async getUser(input: PermissionFindAllByUserIdInputDto) {
    const user = await this.userRepository.findById(input.user_id);

    if (!user) throw new EntityNotFoundError('Usuário', input.user_id, 'id');

    return user;
  }

  private formatPermission(permissions: PermissionDto[]) {
    return permissions.map((permission) => {
      const perm_name = permission.perm_sub_dom_name
        ? `${permission.perm_sub_dom_name}.${permission.perm_name}`
        : permission.perm_name;

      return `${permission.perm_system_name}.${permission.perm_dom_name}.${perm_name}`;
    });
  }
}
