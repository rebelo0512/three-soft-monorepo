import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceQueueMysqlRepository,
  IAttendanceQueueRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../../../src';
import { cleanAttendanceQueueDB, createAttendanceQueue, createPermissionDomain } from '../../../../../../../../helpers';

describe('AttendanceQueueMysqlRepository Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IAttendanceQueueRepository;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new AttendanceQueueMysqlRepository();
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('search', () => {
    it('should return all queues filtered by name', async () => {
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 01', color: '1', tag: '3' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 02', color: '2', tag: '2' });
      await createAttendanceQueue(repository, permissionDomainRepository, { name: 'Queue 11', color: '3', tag: '1' });

      const queues = await repository.search('Queue 0');

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

      const queues_two = await repository.search('Queue 11');

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

      const groups = await repository.search(null);

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

      const queue_created = await repository.findById(queue.queue_id);

      expect(queue_created).toEqual(queue);
    });

    it('should return null if id queue not exist', async () => {
      const queue = await repository.findById(0);

      expect(queue).toBeNull();
    });
  });

  describe('findByTag', () => {
    it('should return queue by tag', async () => {
      const queue = await createAttendanceQueue(repository, permissionDomainRepository);

      const queue_created = await repository.findByTag(queue.queue_tag);

      expect(queue_created).toEqual(queue);
    });

    it('should return null if tag queue not exist', async () => {
      const queue = await repository.findByTag('');

      expect(queue).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return queue by name', async () => {
      const queue = await createAttendanceQueue(repository, permissionDomainRepository);

      const queue_created = await repository.findByName(queue.queue_name);

      expect(queue_created).toEqual(queue);
    });

    it('should return null if name queue not exist', async () => {
      const queue = await repository.findByName('');

      expect(queue).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a queue, tag and permission', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue_created = await repository.create({ name: 'Queue 01', color: '1', tag: '3' });

      const permission = await DatabaseMysqlConnection('permissions')
        .where('perm_name', 'Queue 01')
        .andWhere('perm_sub_dom_name', 'FILAS')
        .andWhere('perm_dom_id', permission_domain.perm_dom_id)
        .first();

      const tag = await DatabaseMysqlConnection('tags').where('tag_name', '3').first();

      expect(queue_created).toEqual({
        queue_id: expect.any(Number),
        queue_name: 'Queue 01',
        queue_color: '1',
        queue_tag: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
      expect(tag).toEqual({
        tag_id: expect.any(Number),
        tag_name: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
      expect(permission).toEqual({
        perm_id: expect.any(Number),
        perm_name: 'Queue 01',
        perm_sub_dom_name: 'FILAS',
        perm_dom_id: permission_domain.perm_dom_id,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should throw error if domain name permission not exist', async () => {
      await expect(() => repository.create({ name: 'Queue 01', color: '1', tag: '3' })).rejects.toThrowError(
        'Domínio de permissão não encontrada pelo(a) nome: LIBERACAO'
      );
    });
  });

  describe('update', () => {
    it('should update a queue', async () => {
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue_created = await repository.create({ name: 'Queue 01', color: '1', tag: '3' });

      const queue_updated = await repository.update({
        id: queue_created.queue_id,
        name: 'Name 01',
        color: '12'
      });

      expect(queue_updated).toEqual({
        queue_id: expect.any(Number),
        queue_name: 'Name 01',
        queue_color: '12',
        queue_tag: '3',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('delete', () => {
    it('should delete a queue, tag and permission', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue = await repository.create({ name: 'Queue 01', color: '1', tag: '3' });

      const queue_created = await repository.findById(queue.queue_id);

      expect(queue_created).toEqual(queue);

      await repository.delete(queue);

      const queue_deleted = await repository.findById(queue.queue_id);

      const permission = await DatabaseMysqlConnection('permissions')
        .where('perm_name', 'Queue 01')
        .andWhere('perm_sub_dom_name', 'FILAS')
        .andWhere('perm_dom_id', permission_domain.perm_dom_id)
        .first();

      const tag = await DatabaseMysqlConnection('tags').where('tag_name', '3').first();

      expect(queue_deleted).toBeNull();
      expect(permission).toBeUndefined();
      expect(tag).toBeUndefined();
    });

    it('should throw error if domain name permission not exist', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository, {
        system_name: 'FIBER_THREE',
        name: 'LIBERACAO'
      });

      const queue = await repository.create({ name: 'Queue 01', color: '1', tag: '3' });

      await DatabaseMysqlConnection('permissions_domains')
        .update({ perm_dom_name: 'To Throw Error' })
        .where('perm_dom_id', permission_domain.perm_dom_id);

      await expect(() => repository.delete(queue)).rejects.toThrowError(
        'Domínio de permissão não encontrada pelo(a) nome: LIBERACAO'
      );
    });
  });
});
