import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { AttendanceHourDto, IAttendanceHourRepository, AttendanceHourRepositoryCreateInput } from '../../../src';

export async function createAttendanceHour(
  repository: IAttendanceHourRepository,
  props?: AttendanceHourRepositoryCreateInput
) {
  const hour = props || {
    start: '09:00',
    end: '12:00',
    name: generateString(10),
    message: generateString(10),
    monday: true,
    tuesday: false,
    wednesday: false,
    thursday: false,
    saturday: false,
    friday: false,
    sunday: false,
    status: true
  };

  return repository.create(hour);
}

export async function createAttendanceHours(repository: IAttendanceHourRepository, total: number) {
  const promises: Array<Promise<AttendanceHourDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        start: '09:00',
        end: '12:00',
        message: `Message ${String(index + 1).padStart(2, '0')}`,
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        saturday: true,
        friday: false,
        sunday: false,
        status: true
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanAttendanceHourDB(connection: Knex) {
  await connection('attendance_hours').delete();
}
