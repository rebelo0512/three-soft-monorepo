import { generateString } from '@three-soft/core-backend';
import { PermissionDomainDto, IPermissionDomainRepository } from '../../../src';

export async function createPermissionDomain(
  repository: IPermissionDomainRepository,
  id: number,
  props?: PermissionDomainDto
) {
  const permission: PermissionDomainDto = props || {
    perm_dom_id: id,
    perm_system_name: generateString(10),
    perm_dom_name: generateString(10),
    created_at: new Date(),
    updated_at: new Date()
  };

  await repository.create(permission);

  return permission;
}

export async function createPermissionDomains(repository: IPermissionDomainRepository, total: number) {
  const promises: Array<Promise<PermissionDomainDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        perm_dom_id: index + 1,
        perm_system_name: `System ${String(index + 1).padStart(2, '0')}`,
        perm_dom_name: `Name ${String(index + 1).padStart(2, '0')}`,
        created_at: new Date(),
        updated_at: new Date()
      })
    );
  }
  await Promise.all(promises);
}
