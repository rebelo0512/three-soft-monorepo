import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository
} from '../../../../../../../../src';
import {
  cleanPermissionDB,
  createPermissions,
  createPermissionDomain,
  createPermission
} from '../../../../../../../helpers';

describe('PermissionMysqlRepository Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all permissions', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermissions(repository, 3, permission_domain.perm_dom_id);

      const permissions = await repository.findAll();

      expect(permissions.length).toBe(3);
      expect(permissions).toEqual([
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 01',
          perm_sub_dom_name: 'Sub Domain 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 02',
          perm_sub_dom_name: 'Sub Domain 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 03',
          perm_sub_dom_name: 'Sub Domain 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        }
      ]);
    });
  });

  describe('findAllByDomainName', () => {
    it('should return all permissions by domain name', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 01', sub_domain: null });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 02', sub_domain: null });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 03', sub_domain: null });

      const permissions = await repository.findAllByDomainName(permission_domain.perm_dom_name);

      expect(permissions.length).toBe(3);
      expect(permissions).toEqual([
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 01',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 02',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 03',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        }
      ]);
    });

    it('should not return a permission with sub domain is not null', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: 'Sub Domain 01'
      });

      const permissions = await repository.findAllByDomainName(permission_domain.perm_dom_name);

      expect(permissions.length).toBe(0);
    });
  });

  describe('findAllBySubDomainName', () => {
    it('should return all permissions by sub domain', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 01', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 02', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 03', sub_domain: null });

      const permissions = await repository.findAllBySubDomainName('Sub Domain');

      expect(permissions.length).toBe(2);
      expect(permissions).toEqual([
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 01',
          perm_sub_dom_name: 'Sub Domain',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 02',
          perm_sub_dom_name: 'Sub Domain',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        }
      ]);
    });
  });

  describe('findAllSubDomainsByDomainId', () => {
    it('should return all subdomains for the domain id', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 01', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 02', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain.perm_dom_id, {
        name: 'Name 03',
        sub_domain: 'Sub Domain 02'
      });

      const sub_domains = await repository.findAllSubDomainsByDomainId(permission_domain.perm_dom_id);

      expect(sub_domains.length).toBe(2);
      expect(sub_domains).toEqual([{ perm_sub_dom_name: 'Sub Domain' }, { perm_sub_dom_name: 'Sub Domain 02' }]);
    });
  });

  describe('findAllBySystemNameAndDomainName', () => {
    it('should return all permissions by system name and domain name', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);
      const permission_domain_two = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 01', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain.perm_dom_id, { name: 'Name 02', sub_domain: 'Sub Domain' });
      await createPermission(repository, permission_domain_two.perm_dom_id, {
        name: 'Name 03',
        sub_domain: 'Sub Domain 02'
      });

      const permissions = await repository.findAllBySystemNameAndDomainName({
        system_name: permission_domain.perm_system_name,
        domain_name: permission_domain.perm_dom_name
      });

      expect(permissions.length).toBe(2);
      expect(permissions).toEqual([
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 01',
          perm_sub_dom_name: 'Sub Domain',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Name 02',
          perm_sub_dom_name: 'Sub Domain',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain.perm_dom_id,
          perm_system_name: permission_domain.perm_system_name,
          perm_dom_name: permission_domain.perm_dom_name
        }
      ]);
    });
  });

  describe('findById', () => {
    it('should return a permission by id', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      const permission = await createPermission(repository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: 'Sub Domain'
      });

      const permission_created = await repository.findById(permission.perm_id);

      expect(permission_created).toEqual({
        perm_id: expect.any(Number),
        perm_name: 'Name 01',
        perm_sub_dom_name: 'Sub Domain',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: permission_domain.perm_dom_id,
        perm_system_name: permission_domain.perm_system_name,
        perm_dom_name: permission_domain.perm_dom_name
      });
    });

    it('should return null if permission id not found', async () => {
      const permission = await repository.findById(0);

      expect(permission).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a permission by name', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      await createPermission(repository, permission_domain.perm_dom_id, {
        name: 'Name 01',
        sub_domain: 'Sub Domain'
      });

      const permission_created = await repository.findByName('Name 01');

      expect(permission_created).toEqual({
        perm_id: expect.any(Number),
        perm_name: 'Name 01',
        perm_sub_dom_name: 'Sub Domain',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: permission_domain.perm_dom_id,
        perm_system_name: permission_domain.perm_system_name,
        perm_dom_name: permission_domain.perm_dom_name
      });
    });

    it('should return null if permission name not found', async () => {
      const permission = await repository.findByName('');

      expect(permission).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const permission_domain = await createPermissionDomain(permissionDomainRepository);

      const permission_created = await repository.create({
        name: 'Name 01',
        sub_domain: 'Sub Domain',
        domain_id: permission_domain.perm_dom_id
      });

      expect(permission_created).toEqual({
        perm_id: expect.any(Number),
        perm_name: 'Name 01',
        perm_sub_dom_name: 'Sub Domain',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: permission_domain.perm_dom_id,
        perm_system_name: permission_domain.perm_system_name,
        perm_dom_name: permission_domain.perm_dom_name
      });
    });
  });
});
