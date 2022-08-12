import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  cleanAttendanceQueueDB,
  createAttendanceQueue,
  createPermissionDomain,
  IAttendanceQueueRepository,
  IPermissionCacheRepository,
  IPermissionDomainRepository,
  PermissionRedisRepository
} from '@three-soft/pkg-configuration';
import { AttendanceQueueController } from '../../../../../../../../../src/modules';
import { createAttendanceQueueModule } from '../../../../../../../../helpers';

describe('AttendanceQueueController Integration Tests', () => {
  let permissionCacheRepository: PermissionRedisRepository;
  let permissionDomainRepository: IPermissionDomainRepository;
  let controller: AttendanceQueueController;
  let repository: IAttendanceQueueRepository;

  beforeAll(async () => {
    const moduleRef = await createAttendanceQueueModule();

    permissionCacheRepository = moduleRef.get<PermissionRedisRepository>(IPermissionCacheRepository.name);
    permissionDomainRepository = moduleRef.get<IPermissionDomainRepository>(IPermissionDomainRepository.name);
    repository = moduleRef.get<IAttendanceQueueRepository>(IAttendanceQueueRepository.name);
    controller = moduleRef.get<AttendanceQueueController>(AttendanceQueueController);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
    permissionCacheRepository.getConnection()?.disconnect();
  });

  describe('search', () => {
    it('should return all queues filtered by name', async () => {
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 01', color: '1', tag: '3' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 02', color: '2', tag: '2' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 11', color: '3', tag: '1' });

      const queues = await controller.search('Queue 0');

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

      const queues_two = await controller.search('Queue 11');

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
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 01', color: '1', tag: '3' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 02', color: '2', tag: '2' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 11', color: '3', tag: '1' });

      const groups = await controller.search(null);

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

  describe('findById', () => {
    it('should return queue by id', async () => {
      const queue = await createAttendanceQueue(repository, permissionDomainRepository);

      const queue_created = await controller.findById(queue.queue_id);

      expect(queue_created).toEqual(queue);
    });

    it('should throw error if queue is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Fila não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('should create a queue', async () => {
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue_created = await controller.create({ name: 'Queue 01', color: '1', tag: '3' });

      expect(queue_created.queue).toEqual({
        queue_id: expect.any(Number),
        queue_name: 'Queue 01',
        queue_color: '1',
        queue_tag: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a queue', async () => {
      const queue = await createAttendanceQueue(repository, permissionDomainRepository);

      const queue_updated = await controller.update(queue.queue_id, {
        id: queue.queue_id,
        name: 'AttendanceQueue Updated',
        color: '762'
      });

      expect(queue_updated.queue).toEqual({
        queue_id: queue.queue_id,
        queue_name: 'AttendanceQueue Updated',
        queue_color: '762',
        queue_tag: queue.queue_tag,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should throw error if queue is not found', async () => {
      await expect(() =>
        controller.update(0, {
          id: 0,
          name: 'AttendanceQueue Updated',
          color: '762'
        })
      ).rejects.toThrowError(`Fila não encontrada pelo(a) id: 0`);
    });
  });

  describe('delete', () => {
    it('should delete a queue', async () => {
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue = await repository.create({ name: 'Queue 01', color: '1', tag: '3' });

      const queue_created = await repository.findById(queue.queue_id);

      expect(queue_created).toEqual(queue);

      await controller.delete(queue.queue_id);

      const queue_deleted = await repository.findById(queue.queue_id);

      expect(queue_deleted).toBeNull();
    });

    it('should throw error if queue is not found', async () => {
      await expect(() => controller.delete(0)).rejects.toThrowError('Fila não encontrada pelo(a) id: 0');
    });
  });
});
