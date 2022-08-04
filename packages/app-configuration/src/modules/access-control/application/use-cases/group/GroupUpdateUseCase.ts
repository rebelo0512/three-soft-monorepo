import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { GroupDto, GroupUpdateInputDto, IGroupRepository, IPermissionRepository, PermissionDto } from '../../../domain';
import { GroupUpdateValidationSchema } from '../../validators';

export class GroupUpdateUseCase extends BaseUseCase<GroupUpdateInputDto, GroupDto> {
  constructor(private groupRepository: IGroupRepository, private permissionRepository: IPermissionRepository) {
    super();
  }

  async execute(input: GroupUpdateInputDto): Promise<GroupDto> {
    const dto = await validateSchema<GroupUpdateInputDto>(GroupUpdateValidationSchema, input);

    const group = await this.getGroup(dto);

    const group_permissions = await this.permissionRepository.findAllByGroupId(group.group_id);

    const permissions_of_domain = await this.getPermissions(dto);

    const { permissions_to_add, permissions_to_delete } = await this.getPermissionsToAddAndDeleteInGroup(
      dto,
      group_permissions,
      permissions_of_domain
    );

    await this.groupRepository.updatePermissions({
      group_id: group.group_id,
      permissions_to_add,
      permissions_to_delete
    });

    return group;
  }

  private async getGroup(dto: GroupUpdateInputDto) {
    const group = await this.groupRepository.findById(dto.id);

    if (!group) throw new EntityNotFoundError('Grupo', dto.id, 'id');

    return group;
  }

  private async getPermissions(dto: GroupUpdateInputDto) {
    if (dto.sub_domain) {
      return this.permissionRepository.findAllBySystemNameAndDomainNameAndSubDomain({
        domain_name: dto.domain,
        system_name: dto.system,
        sub_domain: dto.sub_domain
      });
    }

    return this.permissionRepository.findAllBySystemNameAndDomainName({
      domain_name: dto.domain,
      system_name: dto.system
    });
  }

  private async getPermissionsToAddAndDeleteInGroup(
    dto: GroupUpdateInputDto,
    group_permissions: PermissionDto[],
    permissions_of_domain: PermissionDto[]
  ) {
    const array_of_permissions: {
      permissions_to_add: PermissionDto[];
      permissions_to_delete: PermissionDto[];
    } = { permissions_to_add: [], permissions_to_delete: [] };

    const promises = permissions_of_domain.map(async (permission_of_domain) => {
      await this.getPermissionToAddAndDeleteInGroup(array_of_permissions, dto, permission_of_domain, group_permissions);
    });

    await Promise.all(promises);

    return array_of_permissions;
  }

  private async getPermissionToAddAndDeleteInGroup(
    array_of_permissions: {
      permissions_to_add: PermissionDto[];
      permissions_to_delete: PermissionDto[];
    },
    dto: GroupUpdateInputDto,
    permission_of_domain: PermissionDto,
    group_permissions: PermissionDto[]
  ) {
    const is_permission_in_array = dto.permissions.find((id) => permission_of_domain.perm_id === id);

    if (is_permission_in_array) {
      this.addPermissionInAddArray(array_of_permissions, permission_of_domain, group_permissions);
      return;
    }

    this.deletePermissionInAddArray(array_of_permissions, permission_of_domain, group_permissions);
  }

  private addPermissionInAddArray(
    array_of_permissions: {
      permissions_to_add: PermissionDto[];
      permissions_to_delete: PermissionDto[];
    },
    permission_of_domain: PermissionDto,
    group_permissions: PermissionDto[]
  ) {
    const is_permission_in_group = this.findPermission(permission_of_domain.perm_id, group_permissions);

    if (!is_permission_in_group) {
      array_of_permissions.permissions_to_add.push(permission_of_domain);
    }
  }

  private deletePermissionInAddArray(
    array_of_permissions: {
      permissions_to_add: PermissionDto[];
      permissions_to_delete: PermissionDto[];
    },
    permission_of_domain: PermissionDto,
    group_permissions: PermissionDto[]
  ) {
    const is_permission_in_group = this.findPermission(permission_of_domain.perm_id, group_permissions);

    if (is_permission_in_group) {
      array_of_permissions.permissions_to_delete.push(permission_of_domain);
    }
  }

  private findPermission(permission_id: number, permissions: PermissionDto[]) {
    return permissions.find((perm) => perm.perm_id === permission_id);
  }
}
