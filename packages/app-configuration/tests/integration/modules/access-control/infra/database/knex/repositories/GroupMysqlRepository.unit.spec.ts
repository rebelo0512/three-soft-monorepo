import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { GroupMysqlRepository, IGroupRepository } from '../../../../../../../../src';
import { cleanGroupDB, createGroup, createGroups } from '../../../../../../../helpers';

describe('PermissionDomainMysqlRepository Integration Tests', () => {
  let repository: IGroupRepository;

  beforeAll(async () => {
    repository = new GroupMysqlRepository();
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all groups', async () => {
      await createGroups(repository, 3);

      const groups = await repository.findAll();

      expect(groups.length).toBe(3);
      expect(groups).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('search', () => {
    it('should return all groups filtered by name', async () => {
      await createGroup(repository, 'Group 01');
      await createGroup(repository, 'Group 02');
      await createGroup(repository, 'Group 11');

      const groups = await repository.search('Group 0');

      expect(groups.length).toBe(2);
      expect(groups).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Group 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Group 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);

      const groups_two = await repository.search('Group 11');

      expect(groups_two.length).toBe(1);
      expect(groups_two).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Group 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findById', () => {
    it('should return group by id', async () => {
      const group = await createGroup(repository);

      const group_created = await repository.findById(group.group_id);

      expect(group_created).toEqual({
        group_id: expect.any(Number),
        group_name: group.group_name,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return null if id group not exist', async () => {
      const domain = await repository.findById(0);

      expect(domain).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return group by name', async () => {
      const group = await createGroup(repository);

      const group_created = await repository.findByName(group.group_name);

      expect(group_created).toEqual({
        group_id: expect.any(Number),
        group_name: group.group_name,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return null if name group not exist', async () => {
      const domain = await repository.findByName('');

      expect(domain).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new group', async () => {
      const group_created = await repository.create('Group 01');

      expect(group_created).toEqual({
        group_id: expect.any(Number),
        group_name: 'Group 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('delete', () => {
    it('should delete a group', async () => {
      const group = await createGroup(repository);

      await repository.delete(group.group_id);

      const group_deleted = await repository.findById(group.group_id);

      expect(group_deleted).toBeNull();
    });
  });
});
