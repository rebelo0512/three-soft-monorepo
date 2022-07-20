import { generateString } from '@three-soft/core-backend';
import { GroupDto, IGroupRepository } from '../../../src';

export async function createGroup(repository: IGroupRepository, id: number, props?: GroupDto) {
  const group: GroupDto = props || {
    group_id: id,
    group_name: generateString(10),
    created_at: new Date(),
    updated_at: new Date()
  };

  await repository.create(group);

  return group;
}

export async function createGroups(repository: IGroupRepository, total: number) {
  const promises = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        group_id: index + 1,
        group_name: `Name ${String(index + 1).padStart(2, '0')}`,
        created_at: new Date(),
        updated_at: new Date()
      })
    );
  }
  await Promise.all(promises);
}
