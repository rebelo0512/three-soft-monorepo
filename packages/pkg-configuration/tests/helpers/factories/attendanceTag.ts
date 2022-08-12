import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { AttendanceTagDto, IAttendanceTagRepository } from '../../../src';

export async function createAttendanceTag(repository: IAttendanceTagRepository, name?: string) {
  const permission = name || generateString(10);

  return repository.create(permission);
}

export async function createAttendanceTags(repository: IAttendanceTagRepository, total: number) {
  const promises: Array<Promise<AttendanceTagDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(repository.create(`Name ${String(index + 1).padStart(2, '0')}`));
  }
  await Promise.all(promises);
}

export async function cleanAttendanceTagDB(connection: Knex) {
  await connection('attendance_tags').delete();
}
