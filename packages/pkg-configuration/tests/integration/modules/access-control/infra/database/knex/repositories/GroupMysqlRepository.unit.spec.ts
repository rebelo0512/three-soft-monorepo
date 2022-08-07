import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  GroupMysqlRepository,
  IGroupRepository,
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository
} from '../../../../../../../../src';
import {
  cleanGroupDB,
  createGroup,
  createGroupPermissions,
  createGroups,
  createPermission,
  createPermissionDomain
} from '../../../../../../../helpers';

describe('PermissionDomainMysqlRepository Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let permissionRepository: IPermissionRepository;
  let repository: IGroupRepository;

  beforeAll(async () => {
    permissionRepository = new PermissionMysqlRepository();
    permissionDomainRepository = new PermissionDomainMysqlRepository();
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

    it('should return all groups if no name is provided', async () => {
      await createGroup(repository, 'Group 01');
      await createGroup(repository, 'Group 02');
      await createGroup(repository, 'Group 11');

      const groups = await repository.search(null);

      expect(groups.length).toBe(3);
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
        },
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

  describe('updatePermissions', () => {
    it('should add a new permission and delete other permission to a group', async () => {
      const group = await createGroup(repository);

      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      const permission_one = await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: 'Sub Domain'
      });
      const permission_two = await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 02',
        sub_domain: 'Sub Domain'
      });

      await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [permission_two.perm_id]);

      await repository.updatePermissions({
        group_id: group.group_id,
        permissions_to_add: [permission_one],
        permissions_to_delete: [permission_two]
      });

      const permissions = await permissionRepository.findAllByGroupId(group.group_id);

      expect(permissions.length).toBe(1);
      expect(permissions).toEqual([{ ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) }]);
    });

    it('should do nothing if no permission is passed', async () => {
      const group = await createGroup(repository);

      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: 'Sub Domain'
      });
      const permission_two = await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 02',
        sub_domain: 'Sub Domain'
      });

      await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [permission_two.perm_id]);

      await repository.updatePermissions({
        group_id: group.group_id,
        permissions_to_add: [],
        permissions_to_delete: []
      });

      const permissions = await permissionRepository.findAllByGroupId(group.group_id);

      expect(permissions.length).toBe(1);
      expect(permissions).toEqual([{ ...permission_two, created_at: expect.any(Date), updated_at: expect.any(Date) }]);
    });

    it('should throw error if something is wrong with permissions', async () => {
      const group = await createGroup(repository);

      await expect(async () =>
        repository.updatePermissions({
          group_id: group.group_id,
          permissions_to_add: [[] as never],
          permissions_to_delete: []
        })
      ).rejects.toThrowError(
        // eslint-disable-next-line max-len
        `insert into \`groups_permissions\` (\`group_perm_group_id\`, \`group_perm_perm_id\`) values (${group.group_id}, DEFAULT) - Field 'group_perm_perm_id' doesn't have a default value`
      );
    });
  });

  describe('delete', () => {
    it('should delete a group', async () => {
      const group = await createGroup(repository);

      await repository.delete(group.group_id);

      const group_deleted = await repository.findById(group.group_id);

      expect(group_deleted).toBeNull();
    });

    it('should not delete group if any error happens', async () => {
      await expect(() => repository.delete([] as never)).rejects.toThrowError(
        // eslint-disable-next-line max-len
        "delete from `groups_permissions` where `group_perm_group_id` =  - You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near '' at line 1"
      );
    });
  });
});
