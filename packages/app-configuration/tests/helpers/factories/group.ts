import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { GroupDto, IGroupRepository } from '../../../src';

export async function createGroup(repository: IGroupRepository, name?: string) {
  const group_name = name || generateString(10);

  return repository.create(group_name);
}

export async function createGroups(repository: IGroupRepository, total: number) {
  const promises: Array<Promise<GroupDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(repository.create(`Name ${String(index + 1).padStart(2, '0')}`));
  }
  await Promise.all(promises);
}

export async function cleanGroupDB(connection: Knex) {
  await connection('groups_permissions').delete();
  await connection('´groups´').delete();
}
