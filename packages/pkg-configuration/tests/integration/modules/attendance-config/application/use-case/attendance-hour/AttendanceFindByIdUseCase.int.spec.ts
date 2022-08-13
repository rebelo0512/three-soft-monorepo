import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IAttendanceHourRepository,
  AttendanceHourFindByIdUseCase,
  AttendanceHourMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceHourDB, createAttendanceHour } from '../../../../../../helpers';

describe('AttendanceHourFindByIdUseCase Integration Tests', () => {
  let repository: IAttendanceHourRepository;
  let findByIdUseCase: AttendanceHourFindByIdUseCase;

  beforeAll(async () => {
    repository = new AttendanceHourMysqlRepository();
    findByIdUseCase = new AttendanceHourFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return tag by id', async () => {
    const tag_created = await createAttendanceHour(repository);

    const tag = await findByIdUseCase.execute({ id: tag_created.att_hour_id });

    expect(tag).toEqual(tag_created);
  });

  it('should throw error if tag is not found', async () => {
    await expect(() =>
      findByIdUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Horário de Atendimento não encontrada pelo(a) id: 0');
  });
});
