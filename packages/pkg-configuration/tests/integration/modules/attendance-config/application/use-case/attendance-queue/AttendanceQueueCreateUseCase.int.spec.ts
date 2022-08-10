import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceQueueCreateUseCase,
  AttendanceQueueMysqlRepository,
  IAttendanceQueueRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB } from '../../../../../../helpers';

describe('AttendanceQueueCreateUseCase Integration Tests', () => {
  let repository: IAttendanceQueueRepository;
  let createUseCase: AttendanceQueueCreateUseCase;

  beforeAll(async () => {
    repository = new AttendanceQueueMysqlRepository();
    createUseCase = new AttendanceQueueCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a queue ', async () => {
    const queue = await createUseCase.execute({ name: 'AttendanceQueue 01', color: 'Color 01', tag: 'Tag 01' });

    expect(queue).toEqual({
      queue_id: expect.any(Number),
      queue_name: 'AttendanceQueue 01',
      queue_color: 'Color 01',
      queue_tag: 'Tag 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
