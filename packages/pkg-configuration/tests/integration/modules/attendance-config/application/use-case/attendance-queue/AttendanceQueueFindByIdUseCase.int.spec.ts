import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IAttendanceQueueRepository,
  AttendanceQueueFindByIdUseCase,
  AttendanceQueueMysqlRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB, createAttendanceQueue } from '../../../../../../helpers';

describe('AttendanceQueueFindByIdUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IAttendanceQueueRepository;
  let findByIdUseCase: AttendanceQueueFindByIdUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new AttendanceQueueMysqlRepository();
    findByIdUseCase = new AttendanceQueueFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return queue by id', async () => {
    const queue_created = await createAttendanceQueue(repository, permissionDomainRepository);

    const queue = await findByIdUseCase.execute({ id: queue_created.queue_id });

    expect(queue).toEqual(queue_created);
  });

  it('should throw error if queue is not found', async () => {
    await expect(() =>
      findByIdUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Fila não encontrada pelo(a) id: 0');
  });
});
