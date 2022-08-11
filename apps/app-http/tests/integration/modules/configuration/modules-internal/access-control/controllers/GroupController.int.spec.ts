import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import {
  cleanGroupDB,
  createGroup,
  createGroupPermissions,
  createGroups,
  createPermission,
  createPermissionDomain,
  IGroupRepository,
  IPermissionCacheRepository,
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionRedisRepository
} from '@three-soft/pkg-configuration';
import { GroupController } from '../../../../../../../src/modules';
import { createAccessControlModule } from '../../../../../../helpers';

describe('GroupController Integration Tests', () => {
  let permissionCacheRepository: PermissionRedisRepository;
  let permissionDomainRepository: IPermissionDomainRepository;
  let permissionRepository: IPermissionRepository;
  let controller: GroupController;
  let repository: IGroupRepository;

  beforeAll(async () => {
    const moduleRef = await createAccessControlModule();

    permissionCacheRepository = moduleRef.get<PermissionRedisRepository>(IPermissionCacheRepository.name);
    permissionDomainRepository = moduleRef.get<IPermissionDomainRepository>(IPermissionDomainRepository.name);
    permissionRepository = moduleRef.get<IPermissionRepository>(IPermissionRepository.name);
    repository = moduleRef.get<IGroupRepository>(IGroupRepository.name);
    controller = moduleRef.get<GroupController>(GroupController);
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
    permissionCacheRepository.getConnection()?.disconnect();
  });

  describe('findAll', () => {
    it('must return a array of group', async () => {
      await createGroups(repository, 3);

      const groups = await controller.findAll();

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
    it('should return all groups based on name', async () => {
      await createGroup(repository, 'Group 01');
      await createGroup(repository, 'Group 02');
      await createGroup(repository, 'Group 11');

      const groups = await controller.search({ name: 'Group 0' });

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

      const groups_two = await controller.search({ name: 'Group 11' });

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

  describe('create', () => {
    it('should create a group', async () => {
      const group = await controller.create({ name: 'Group 01' });

      expect(group.group).toEqual({
        group_id: expect.any(Number),
        group_name: 'Group 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update permissions of group without sub domain', async () => {
      const group = await createGroup(repository);

      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      const permission_one = await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: null
      });
      const permission_two = await createPermission(permissionRepository, permission_domain.perm_dom_id, {
        name: 'Name 02',
        sub_domain: null
      });

      await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [permission_two.perm_id]);

      await controller.update(group.group_id, {
        id: group.group_id,
        domain: permission_domain.perm_dom_name,
        system: permission_domain.perm_system_name,
        sub_domain: null,
        permissions: [permission_one.perm_id]
      });

      const permissions = await permissionRepository.findAllByGroupId(group.group_id);

      expect(permissions.length).toBe(1);
      expect(permissions).toEqual([{ ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) }]);
    });

    it('should update permissions of group with sub domain', async () => {
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

      await controller.update(group.group_id, {
        id: group.group_id,
        domain: permission_domain.perm_dom_name,
        system: permission_domain.perm_system_name,
        sub_domain: permission_one.perm_sub_dom_name,
        permissions: [permission_one.perm_id]
      });

      const permissions = await permissionRepository.findAllByGroupId(group.group_id);

      expect(permissions.length).toBe(1);
      expect(permissions).toEqual([{ ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) }]);
    });

    it('should throw error when group not found', async () => {
      const string_error = generateString(25);

      await expect(async () =>
        controller.update(0, {
          id: 0,
          domain: string_error,
          system: string_error,
          sub_domain: string_error,
          permissions: []
        })
      ).rejects.toThrowError(`Grupo não encontrada pelo(a) id: 0`);
    });
  });
});
