import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  cleanPermissionDB,
  createGroup,
  createGroupPermissions,
  createPermission,
  createPermissionDomain,
  createCompany,
  createUser
} from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository,
  IGroupRepository,
  GroupMysqlRepository,
  UserMysqlRepository,
  IUserRepository,
  ICompanyRepository,
  CompanyMysqlRepository,
  PermissionFindAllByUserIdUseCase,
  PermissionRedisRepository
} from '../../../../../../../src';

describe('PermissionFindAllByUserIdUseCase Integration Tests', () => {
  let permissionCacheRepository: PermissionRedisRepository;
  let companyRepository: ICompanyRepository;
  let userRepository: IUserRepository;
  let groupRepository: IGroupRepository;
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;
  let findAllByUserIdUseCase: PermissionFindAllByUserIdUseCase;

  beforeAll(async () => {
    permissionCacheRepository = new PermissionRedisRepository();
    companyRepository = new CompanyMysqlRepository();
    userRepository = new UserMysqlRepository();
    groupRepository = new GroupMysqlRepository();
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
    findAllByUserIdUseCase = new PermissionFindAllByUserIdUseCase(
      repository,
      userRepository,
      permissionCacheRepository
    );
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
    permissionCacheRepository.getConnection()?.disconnect();
  });

  it('should return all permissions by user id', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user = await createUser(userRepository, { company_id: company.comp_id, group_id: group.group_id });

    const domain = await createPermissionDomain(permissionDomainRepository);

    const permission_one = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 01',
      sub_domain: 'Sub 01'
    });
    const permission_two = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 02',
      sub_domain: null
    });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: 'Sub 02' });

    await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [
      permission_one.perm_id,
      permission_two.perm_id
    ]);

    const permissions = await findAllByUserIdUseCase.execute({ user_id: user.user_id });

    expect(permissions.length).toBe(2);
    expect(permissions).toEqual([
      `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_one.perm_sub_dom_name}.${permission_one.perm_name}`,
      `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_two.perm_name}`
    ]);
  });

  it('should return all permissions using cache by user id', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user = await createUser(userRepository, { company_id: company.comp_id, group_id: group.group_id });

    const domain = await createPermissionDomain(permissionDomainRepository);

    const permission_one = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 01',
      sub_domain: 'Sub 01'
    });
    const permission_two = await createPermission(repository, domain.perm_dom_id, {
      name: 'Perm 02',
      sub_domain: null
    });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: 'Sub 02' });

    await createGroupPermissions(DatabaseMysqlConnection, group.group_id, [
      permission_one.perm_id,
      permission_two.perm_id
    ]);

    await findAllByUserIdUseCase.execute({ user_id: user.user_id });

    const permissions = await findAllByUserIdUseCase.execute({ user_id: user.user_id });

    expect(permissions.length).toBe(2);
    expect(permissions).toEqual([
      `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_one.perm_sub_dom_name}.${permission_one.perm_name}`,
      `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_two.perm_name}`
    ]);
  });

  it('should throw error when user not found', async () => {
    await expect(async () => findAllByUserIdUseCase.execute({ user_id: 0 })).rejects.toThrowError(
      `Usuário não encontrada pelo(a) id: 0`
    );
  });
});
