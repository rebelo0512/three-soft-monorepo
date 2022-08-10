import { BaseUseCase, EntityNotFoundError, ICacheBaseRepository } from '@three-soft/core-backend';
import { IPermissionRepository, PermissionDto, PermissionFindAllByUserIdInputDto } from '../../../domain';
import { IUserRepository } from '../../../../user';

export class PermissionFindAllByUserIdUseCase extends BaseUseCase<PermissionFindAllByUserIdInputDto, string[]> {
  private cache_key = 'CUSTOMER_PERMISSIONS-CUSTOMER_ID';

  constructor(
    private permissionRepository: IPermissionRepository,
    private userRepository: IUserRepository,
    private permissionCacheRepository: ICacheBaseRepository
  ) {
    super();
  }

  async execute(input: PermissionFindAllByUserIdInputDto): Promise<string[]> {
    const user = await this.getUser(input);

    const cache = await this.getCache(input);

    if (cache) {
      return this.formatCache(cache);
    }

    const permissions = await this.permissionRepository.findAllByGroupId(user.group_id);

    const permissions_formatted = this.formatPermission(permissions);

    await this.createCache(permissions_formatted);

    return permissions_formatted;
  }

  private async getUser(input: PermissionFindAllByUserIdInputDto) {
    const user = await this.userRepository.findById(input.user_id);

    if (!user) throw new EntityNotFoundError('Usuário', input.user_id, 'id');

    return user;
  }

  private async getCache(input: PermissionFindAllByUserIdInputDto) {
    const cache_key = `${this.cache_key}-${input.user_id}`;

    this.permissionCacheRepository.setKey(cache_key);

    const cache = await this.permissionCacheRepository.getCache();

    return cache;
  }

  private formatCache(cache: string): string[] {
    return JSON.parse(cache);
  }

  private async createCache(permissions_formatted: string[]) {
    await this.permissionCacheRepository.setCache(JSON.stringify(permissions_formatted), 60 * 60);
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
