import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import {
  GroupUpdateUseCase,
  GroupMysqlRepository,
  IGroupRepository,
  IPermissionRepository,
  PermissionMysqlRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';
import {
  cleanGroupDB,
  createGroup,
  createGroupPermissions,
  createPermission,
  createPermissionDomain
} from '../../../../../../helpers';

describe('GroupUpdateUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let permissionRepository: IPermissionRepository;
  let repository: IGroupRepository;
  let updateUseCase: GroupUpdateUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    permissionRepository = new PermissionMysqlRepository();
    repository = new GroupMysqlRepository();
    updateUseCase = new GroupUpdateUseCase(repository, permissionRepository);
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

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

    await updateUseCase.execute({
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

    await updateUseCase.execute({
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
      updateUseCase.execute({
        id: 0,
        domain: string_error,
        system: string_error,
        sub_domain: string_error,
        permissions: []
      })
    ).rejects.toThrowError(`Entidade não encontrada pelo(a) id: 0`);
  });
});
