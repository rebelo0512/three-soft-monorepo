import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceQueueDeleteUseCase,
  AttendanceQueueMysqlRepository,
  IAttendanceQueueRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB, createAttendanceQueue } from '../../../../../../helpers';

describe('AttendanceQueueDeleteUseCase Integration Tests', () => {
  let repository: IAttendanceQueueRepository;
  let deleteUseCase: AttendanceQueueDeleteUseCase;

  beforeAll(async () => {
    repository = new AttendanceQueueMysqlRepository();
    deleteUseCase = new AttendanceQueueDeleteUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should delete a queue', async () => {
    const queue = await createAttendanceQueue(repository);

    const queue_created = await repository.findById(queue.queue_id);

    expect(queue_created).toEqual(queue);

    await deleteUseCase.execute({ id: queue.queue_id });

    const queue_deleted = await repository.findById(queue.queue_id);

    expect(queue_deleted).toBeNull();
  });

  it('should throw error if queue is not found', async () => {
    await expect(() =>
      deleteUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Fila não encontrada pelo(a) id: 0');
  });
});
