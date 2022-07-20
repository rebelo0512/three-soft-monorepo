import { generateString } from '@three-soft/core-backend';
import { PermissionDto, IPermissionRepository } from '../../../src';

export async function createPermission(repository: IPermissionRepository, id: number, props?: PermissionDto) {
  const permission: PermissionDto = props || {
    perm_id: id,
    perm_dom_id: 1,
    perm_sub_dom_name: generateString(10),
    perm_name: generateString(10),
    created_at: new Date(),
    updated_at: new Date()
  };

  await repository.create(permission);

  return permission;
}

export async function createPermissions(repository: IPermissionRepository, total: number) {
  const promises = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        perm_id: index + 1,
        perm_dom_id: 1,
        perm_sub_dom_name: `Sub Domain ${String(index + 1).padStart(2, '0')}`,
        perm_name: `Name ${String(index + 1).padStart(2, '0')}`,
        created_at: new Date(),
        updated_at: new Date()
      })
    );
  }
  await Promise.all(promises);
}
