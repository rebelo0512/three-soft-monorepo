import { generateString, OmitBaseDto } from '@three-soft/core-backend';
import { PermissionDto, IPermissionRepository, PermissionDomainDto } from '../../../src';

export async function createPermission(repository: IPermissionRepository, id: number, props?: PermissionDto) {
  const permission: PermissionDto = props || {
    perm_id: id,
    perm_sub_dom_name: generateString(10),
    perm_name: generateString(10),
    created_at: new Date(),
    updated_at: new Date(),
    perm_dom_id: id * 2,
    perm_dom_name: generateString(10),
    perm_system_name: generateString(10)
  };

  await repository.create(permission);

  return permission;
}

export async function createPermissions(
  repository: IPermissionRepository,
  total: number,
  permission_domain?: OmitBaseDto<PermissionDomainDto>
) {
  const promises: Array<Promise<PermissionDto>> = [];
  for (let index = 0; index < total; index += 1) {
    const permission_domain_entity = permission_domain || {
      perm_dom_id: index * 2,
      perm_dom_name: generateString(10),
      perm_system_name: generateString(10)
    };

    promises.push(
      repository.create({
        perm_id: index + 1,
        perm_sub_dom_name: `Sub Domain ${String(index + 1).padStart(2, '0')}`,
        perm_name: `Name ${String(index + 1).padStart(2, '0')}`,
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain_entity
      })
    );
  }
  await Promise.all(promises);
}
