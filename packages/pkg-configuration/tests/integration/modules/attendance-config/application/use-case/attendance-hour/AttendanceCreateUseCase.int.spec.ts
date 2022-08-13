import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceHourCreateUseCase,
  AttendanceHourMysqlRepository,
  IAttendanceHourRepository
} from '../../../../../../../src';
import { cleanAttendanceHourDB } from '../../../../../../helpers';

describe('AttendanceHourCreateUseCase Integration Tests', () => {
  let repository: IAttendanceHourRepository;
  let createUseCase: AttendanceHourCreateUseCase;

  beforeAll(async () => {
    repository = new AttendanceHourMysqlRepository();
    createUseCase = new AttendanceHourCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a hour ', async () => {
    const queue = await createUseCase.execute({
      name: 'Name 09',
      status: true,
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: true,
      sunday: false,
      message: 'Message 09',
      start: '09:00',
      end: '12:00'
    });

    expect(queue).toEqual({
      att_hour_id: expect.any(Number),
      att_hour_name: 'Name 09',
      att_hour_status: 1,
      att_hour_monday: 1,
      att_hour_tuesday: 0,
      att_hour_wednesday: 1,
      att_hour_thursday: 0,
      att_hour_friday: 0,
      att_hour_saturday: 1,
      att_hour_sunday: 0,
      att_hour_message: 'Message 09',
      att_hour_start: '09:00',
      att_hour_end: '12:00',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
