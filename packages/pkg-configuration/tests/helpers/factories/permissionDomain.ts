import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { PermissionDomainDto, IPermissionDomainRepository, PermissionDomainRepositoryCreateInput } from '../../../src';

export async function createPermissionDomain(
  repository: IPermissionDomainRepository,
  props?: PermissionDomainRepositoryCreateInput
) {
  const permission = props || {
    system_name: generateString(10),
    name: generateString(10)
  };

  return repository.create(permission);
}

export async function createPermissionDomains(repository: IPermissionDomainRepository, total: number) {
  const promises: Array<Promise<PermissionDomainDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        system_name: `System ${String(index + 1).padStart(2, '0')}`,
        name: `Name ${String(index + 1).padStart(2, '0')}`
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanPermissionDomainDB(connection: Knex) {
  await connection('permissions').delete();
  await connection('permissions_domains').delete();
}
