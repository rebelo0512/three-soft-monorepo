import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import {
  cleanPermissionDB,
  createCompany,
  createGroup,
  createGroupPermissions,
  createPermission,
  createPermissionDomain,
  createUser,
  ICompanyRepository,
  IGroupRepository,
  IPermissionDomainRepository,
  IPermissionRepository,
  IUserRepository
} from '@three-soft/pkg-configuration';
import { PermissionController } from '../../../../../../../src/modules';
import { createAccessControlModule } from '../../../../../../helpers';

describe('PermissionController Integration Tests', () => {
  let companyRepository: ICompanyRepository;
  let userRepository: IUserRepository;
  let permissionDomainRepository: IPermissionDomainRepository;
  let groupRepository: IGroupRepository;
  let controller: PermissionController;
  let repository: IPermissionRepository;

  beforeAll(async () => {
    const moduleRef = await createAccessControlModule();

    companyRepository = moduleRef.get<ICompanyRepository>(ICompanyRepository.name);
    userRepository = moduleRef.get<IUserRepository>(IUserRepository.name);
    permissionDomainRepository = moduleRef.get<IPermissionDomainRepository>(IPermissionDomainRepository.name);
    groupRepository = moduleRef.get<IGroupRepository>(IGroupRepository.name);
    repository = moduleRef.get<IPermissionRepository>(IPermissionRepository.name);
    controller = moduleRef.get<PermissionController>(PermissionController);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAllByGroupId', () => {
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

      const permissions = await controller.findAllByGroupId(group.group_id);

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

    it('should throw error when group not found', async () => {
      await expect(async () => controller.findAllByGroupId(0)).rejects.toThrowError(
        `Grupo não encontrada pelo(a) id: 0`
      );
    });
  });

  describe('findAllByUserId', () => {
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

      const permissions = await controller.findAllByUserId(user.user_id);

      expect(permissions.length).toBe(2);
      expect(permissions).toEqual([
        `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_one.perm_sub_dom_name}.${permission_one.perm_name}`,
        `${domain.perm_system_name}.${domain.perm_dom_name}.${permission_two.perm_name}`
      ]);
    });

    it('should throw error when user not found', async () => {
      await expect(async () => controller.findAllByUserId(0)).rejects.toThrowError(
        `Usuário não encontrada pelo(a) id: 0`
      );
    });
  });

  describe('findAllSystems', () => {
    it('should return all systems', async () => {
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 01',
        name: 'Name 01'
      });
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 01',
        name: 'Name 02'
      });
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 02',
        name: 'Name 01'
      });

      const domains = await controller.findAllSystems();

      expect(domains.length).toBe(2);
      expect(domains).toEqual([
        {
          perm_system_name: 'System 01'
        },
        {
          perm_system_name: 'System 02'
        }
      ]);
    });
  });

  describe('findAllByDomainName', () => {
    it('should return all permissions by domain name and system name', async () => {
      const domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 01', sub_domain: null });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 02', sub_domain: null });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: null });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 04', sub_domain: 'Sub 01' });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 05', sub_domain: 'Sub 01' });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 06', sub_domain: 'Sub 02' });

      const result = await controller.findAllByDomainName({
        system_name: domain.perm_system_name,
        domain_name: domain.perm_dom_name
      });

      expect(result.permissions.length).toBe(3);
      expect(result.sub_dom.length).toBe(2);
      expect(result).toEqual({
        permissions: [
          {
            perm_id: expect.any(Number),
            perm_name: 'Perm 01',
            perm_sub_dom_name: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            perm_dom_id: domain.perm_dom_id,
            perm_system_name: domain.perm_system_name,
            perm_dom_name: domain.perm_dom_name
          },
          {
            perm_id: expect.any(Number),
            perm_name: 'Perm 02',
            perm_sub_dom_name: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            perm_dom_id: domain.perm_dom_id,
            perm_system_name: domain.perm_system_name,
            perm_dom_name: domain.perm_dom_name
          },
          {
            perm_id: expect.any(Number),
            perm_name: 'Perm 03',
            perm_sub_dom_name: null,
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            perm_dom_id: domain.perm_dom_id,
            perm_system_name: domain.perm_system_name,
            perm_dom_name: domain.perm_dom_name
          }
        ],
        sub_dom: [
          {
            perm_sub_dom_name: 'Sub 01'
          },
          {
            perm_sub_dom_name: 'Sub 02'
          }
        ]
      });
    });

    it('should throw error when permission domain not found', async () => {
      const string_error = generateString(25);

      await expect(async () =>
        controller.findAllByDomainName({
          system_name: string_error,
          domain_name: string_error
        })
      ).rejects.toThrowError(`Domínio da Permissão não encontrada pelo(a) nome: ${string_error}`);
    });
  });

  describe('findAllBySystemName', () => {
    it('should return all permission domains by system name', async () => {
      const domain_one = await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 01',
        name: 'Name 01'
      });
      const domain_two = await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 01',
        name: 'Name 02'
      });
      await createPermissionDomain(permissionDomainRepository, {
        system_name: 'System 02',
        name: 'Name 01'
      });

      const domains = await controller.findAllBySystemName('System 01');

      expect(domains.length).toBe(2);
      expect(domains).toEqual([
        {
          perm_dom_id: domain_one.perm_dom_id,
          perm_system_name: domain_one.perm_system_name,
          perm_dom_name: domain_one.perm_dom_name,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          perm_dom_id: domain_two.perm_dom_id,
          perm_system_name: domain_two.perm_system_name,
          perm_dom_name: domain_two.perm_dom_name,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findAllBySubDomain', () => {
    it('should return all permissions by sub domain', async () => {
      const domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 01', sub_domain: 'Sub 01' });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 02', sub_domain: 'Sub 01' });
      await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: 'Sub 02' });

      const permissions = await controller.findAllBySubDomain('Sub 01');

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
  });

  describe('create', () => {
    it('should create a permission', async () => {
      const domain = await createPermissionDomain(permissionDomainRepository);

      const permission = await controller.create({
        system_name: domain.perm_system_name,
        domain: domain.perm_dom_name,
        name: 'Permission 01',
        sub_domain: null
      });

      expect(permission).toEqual({
        perm_id: expect.any(Number),
        perm_name: 'Permission 01',
        perm_sub_dom_name: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: domain.perm_dom_id,
        perm_system_name: domain.perm_system_name,
        perm_dom_name: domain.perm_dom_name
      });
    });

    it('should throw error when permission domain not found', async () => {
      const string_error = generateString(25);

      await expect(async () =>
        controller.create({
          system_name: string_error,
          domain: string_error,
          name: 'Permission 01',
          sub_domain: null
        })
      ).rejects.toThrowError(`Domínio da Permissão não encontrada pelo(a) nome: ${string_error}`);
    });
  });
});
