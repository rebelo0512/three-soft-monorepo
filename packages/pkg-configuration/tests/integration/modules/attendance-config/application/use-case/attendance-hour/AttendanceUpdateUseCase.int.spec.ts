import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceHourUpdateUseCase,
  AttendanceHourMysqlRepository,
  IAttendanceHourRepository
} from '../../../../../../../src';
import { cleanAttendanceHourDB, createAttendanceHour } from '../../../../../../helpers';

describe('AttendanceHourUpdateUseCase Integration Tests', () => {
  let repository: IAttendanceHourRepository;
  let updateUseCase: AttendanceHourUpdateUseCase;

  beforeAll(async () => {
    repository = new AttendanceHourMysqlRepository();
    updateUseCase = new AttendanceHourUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a hour', async () => {
    const hour = await createAttendanceHour(repository);

    const hour_updated = await updateUseCase.execute({
      id: hour.att_hour_id,
      name: 'Name Updated',
      status: true,
      monday: true,
      tuesday: false,
      wednesday: true,
      thursday: false,
      friday: false,
      saturday: true,
      sunday: false,
      message: 'Message Updated',
      start: '09:00',
      end: '12:00'
    });

    expect(hour_updated).toEqual({
      att_hour_id: expect.any(Number),
      att_hour_name: 'Name Updated',
      att_hour_status: 1,
      att_hour_monday: 1,
      att_hour_tuesday: 0,
      att_hour_wednesday: 1,
      att_hour_thursday: 0,
      att_hour_friday: 0,
      att_hour_saturday: 1,
      att_hour_sunday: 0,
      att_hour_message: 'Message Updated',
      att_hour_start: '09:00',
      att_hour_end: '12:00',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if hour is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'AttendanceHour Updated',
        status: true,
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: false,
        message: 'Message Updated',
        start: '09:00',
        end: '12:00'
      })
    ).rejects.toThrowError(`Horário de Atendimento não encontrada pelo(a) id: ${id_error}`);
  });
});
