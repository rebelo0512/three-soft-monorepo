import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IAttendanceQueueRepository,
  AttendanceQueueMysqlRepository,
  AttendanceQueueSearchUseCase,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB, createAttendanceQueue, createPermissionDomain } from '../../../../../../helpers';

describe('AttendanceQueueSearchUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IAttendanceQueueRepository;
  let searchUseCase: AttendanceQueueSearchUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new AttendanceQueueMysqlRepository();
    searchUseCase = new AttendanceQueueSearchUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all queues filtered by name', async () => {
    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 01', color: '1', tag: '3' });
    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 02', color: '2', tag: '2' });
    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 11', color: '3', tag: '1' });

    const queues = await searchUseCase.execute({ name: 'Queue 0' });

    expect(queues.length).toBe(2);
    expect(queues).toEqual([
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 01',
        queue_color: '1',
        queue_tag: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 02',
        queue_color: '2',
        queue_tag: '2',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);

    const queues_two = await searchUseCase.execute({ name: 'Queue 11' });

    expect(queues_two.length).toBe(1);
    expect(queues_two).toEqual([
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 11',
        queue_color: '3',
        queue_tag: '1',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should return all queues if no name is provided', async () => {
    await createPermissionDomain(permissionDomainRepository, {
      system_name: 'FIBER_THREE',
      name: 'LIBERACAO'
    });

    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 01', color: '1', tag: '3' });
    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 02', color: '2', tag: '2' });
    await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 11', color: '3', tag: '1' });

    const groups = await searchUseCase.execute({ name: null });

    expect(groups.length).toBe(3);
    expect(groups).toEqual([
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 01',
        queue_color: '1',
        queue_tag: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 02',
        queue_color: '2',
        queue_tag: '2',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        queue_id: expect.any(Number),
        queue_name: 'Queue 11',
        queue_color: '3',
        queue_tag: '1',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
