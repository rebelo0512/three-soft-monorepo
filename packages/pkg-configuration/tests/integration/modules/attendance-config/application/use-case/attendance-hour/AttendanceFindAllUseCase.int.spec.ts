import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceHourFindAllUseCase,
  AttendanceHourMysqlRepository,
  IAttendanceHourRepository
} from '../../../../../../../src';
import { cleanAttendanceHourDB, createAttendanceHours } from '../../../../../../helpers';

describe('AttendanceHourFindAllUseCase Integration Tests', () => {
  let repository: IAttendanceHourRepository;
  let findAllUseCase: AttendanceHourFindAllUseCase;

  beforeAll(async () => {
    repository = new AttendanceHourMysqlRepository();
    findAllUseCase = new AttendanceHourFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all hours', async () => {
    await createAttendanceHours(repository, 3);

    const hours = await findAllUseCase.execute();

    expect(hours.length).toBe(3);
    expect(hours).toEqual([
      {
        att_hour_id: expect.any(Number),
        att_hour_name: 'Name 01',
        att_hour_status: 1,
        att_hour_monday: 1,
        att_hour_tuesday: 0,
        att_hour_wednesday: 1,
        att_hour_thursday: 0,
        att_hour_friday: 0,
        att_hour_saturday: 1,
        att_hour_sunday: 0,
        att_hour_message: 'Message 01',
        att_hour_start: '09:00',
        att_hour_end: '12:00',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_hour_id: expect.any(Number),
        att_hour_name: 'Name 02',
        att_hour_status: 1,
        att_hour_monday: 1,
        att_hour_tuesday: 0,
        att_hour_wednesday: 1,
        att_hour_thursday: 0,
        att_hour_friday: 0,
        att_hour_saturday: 1,
        att_hour_sunday: 0,
        att_hour_message: 'Message 02',
        att_hour_start: '09:00',
        att_hour_end: '12:00',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_hour_id: expect.any(Number),
        att_hour_name: 'Name 03',
        att_hour_status: 1,
        att_hour_monday: 1,
        att_hour_tuesday: 0,
        att_hour_wednesday: 1,
        att_hour_thursday: 0,
        att_hour_friday: 0,
        att_hour_saturday: 1,
        att_hour_sunday: 0,
        att_hour_message: 'Message 03',
        att_hour_start: '09:00',
        att_hour_end: '12:00',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
