import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  cleanPermissionDB,
  createGroup,
  createGroupPermissions,
  createPermission,
  createPermissionDomain
} from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionFindAllByGroupIdUseCase,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository,
  IGroupRepository,
  GroupMysqlRepository
} from '../../../../../../../src';

describe('PermissionFindAllByGroupIdUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;
  let findAllByGroupIdUseCase: PermissionFindAllByGroupIdUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
    findAllByGroupIdUseCase = new PermissionFindAllByGroupIdUseCase(repository, groupRepository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all permissions by group id', async () => {
    const group = await createGroup(groupRepository);

    const domain = await createPermissionDomain(permissionDomainRepository);

    const permission_one = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 01',
      sub_domain: 'Sub 01'
    });
    const permission_two = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 02',
      sub_domain: 'Sub 01'
    });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: 'Sub 02' });

    await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [
      permission_one.perm_id,
      permission_two.perm_id
    ]);

    const permissions = await findAllByGroupIdUseCase.execute({ group_id: group.group_id });

    expect(permissions.length).toBe(2);
    expect(permissions).toEqual([
      {
        perm_id: expect.any(Number),
        perm_name: 'Perm 01',
        perm_sub_dom_name: 'Sub 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: domain.perm_dom_id,
        perm_system_name: domain.perm_system_name,
        perm_dom_name: domain.perm_dom_name
      },
      {
        perm_id: expect.any(Number),
        perm_name: 'Perm 02',
        perm_sub_dom_name: 'Sub 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: domain.perm_dom_id,
        perm_system_name: domain.perm_system_name,
        perm_dom_name: domain.perm_dom_name
      }
    ]);
  });

  it('should throw error when gorup not found', async () => {
    await expect(async () => findAllByGroupIdUseCase.execute({ group_id: 0 })).rejects.toThrowError(
      `Entidade não encontrada pelo(a) id: 0`
    );
  });
});
