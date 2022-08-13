import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceHourDeleteUseCase,
  AttendanceHourMysqlRepository,
  IAttendanceHourRepository
} from '../../../../../../../src';
import { cleanAttendanceHourDB, createAttendanceHour } from '../../../../../../helpers';

describe('AttendanceHourDeleteUseCase Integration Tests', () => {
  let repository: IAttendanceHourRepository;
  let deleteUseCase: AttendanceHourDeleteUseCase;

  beforeAll(async () => {
    repository = new AttendanceHourMysqlRepository();
    deleteUseCase = new AttendanceHourDeleteUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should delete a hour', async () => {
    const hour = await createAttendanceHour(repository);

    const hour_created = await repository.findById(hour.att_hour_id);

    expect(hour_created).toEqual(hour);

    await deleteUseCase.execute({ id: hour.att_hour_id });

    const hour_deleted = await repository.findById(hour.att_hour_id);

    expect(hour_deleted).toBeNull();
  });

  it('should throw error if hour is not found', async () => {
    await expect(() =>
      deleteUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Horário de Atendimento não encontrada pelo(a) id: 0');
  });
});
