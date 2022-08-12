import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceQueueUpdateUseCase,
  AttendanceQueueMysqlRepository,
  IAttendanceQueueRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB, createAttendanceQueue } from '../../../../../../helpers';

describe('AttendanceQueueUpdateUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IAttendanceQueueRepository;
  let updateUseCase: AttendanceQueueUpdateUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new AttendanceQueueMysqlRepository();
    updateUseCase = new AttendanceQueueUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a queue', async () => {
    const queue = await createAttendanceQueue(repository, permissionDomainRepository);

    const queue_updated = await updateUseCase.execute({
      id: queue.queue_id,
      name: 'AttendanceQueue Updated',
      color: '762'
    });

    expect(queue_updated).toEqual({
      queue_id: queue.queue_id,
      queue_name: 'AttendanceQueue Updated',
      queue_color: '762',
      queue_tag: queue.queue_tag,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if queue is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'AttendanceQueue Updated',
        color: '762'
      })
    ).rejects.toThrowError(`Fila não encontrada pelo(a) id: ${id_error}`);
  });
});
