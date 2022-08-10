import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { AttendanceQueueDto, IAttendanceQueueRepository, AttendanceQueueRepositoryCreateInput } from '../../../src';

export async function createAttendanceQueue(
  repository: IAttendanceQueueRepository,
  props?: AttendanceQueueRepositoryCreateInput
) {
  const permission = props || {
    color: generateString(10),
    name: generateString(10),
    tag: generateString(10)
  };

  return repository.create(permission);
}

export async function createAttendanceQueues(repository: IAttendanceQueueRepository, total: number) {
  const promises: Array<Promise<AttendanceQueueDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        color: `Color ${String(index + 1).padStart(2, '0')}`,
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        tag: `Color ${String(index + 1).padStart(2, '0')}`
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanAttendanceQueueDB(connection: Knex) {
  await connection('attendance_queue').delete();
}
