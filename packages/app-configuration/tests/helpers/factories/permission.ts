import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { PermissionDto, IPermissionRepository, PermissionRepositoryCreateInput } from '../../../src';

export async function createPermission(
  repository: IPermissionRepository,
  domain_id: number,
  props?: Omit<PermissionRepositoryCreateInput, 'domain_id'>
) {
  const permission = await repository.create({
    sub_domain: props?.sub_domain || null,
    name: props?.name || `Name ${generateString(5)}`,
    domain_id
  });

  return permission;
}

export async function createPermissions(
  repository: IPermissionRepository,
  total: number,
  permission_domain_id: number
) {
  const promises: Array<Promise<PermissionDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        sub_domain: `Sub Domain ${String(index + 1).padStart(2, '0')}`,
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        domain_id: permission_domain_id
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanPermissionDB(connection: Knex) {
  await connection('groups_permissions').delete();
  await connection('permissions').delete();
  await connection('permissions_domains').delete();
}
