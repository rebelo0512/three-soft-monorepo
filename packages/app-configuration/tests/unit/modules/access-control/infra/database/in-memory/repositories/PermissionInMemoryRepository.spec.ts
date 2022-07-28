import { OmitBaseDto } from '@three-soft/core-backend';
import { PermissionInMemoryRepository, IPermissionRepository, PermissionDomainDto } from '../../../../../../../../src';
import { createPermission } from '../../../../../../../helpers';

describe('PermissionInMemoryRepository Unit Tests', () => {
  let repository: IPermissionRepository;

  beforeEach(() => {
    repository = new PermissionInMemoryRepository();
  });

  describe('findByDomainName', () => {
    it('should return permissions by domain name', async () => {
      const permission_domain: OmitBaseDto<PermissionDomainDto> = {
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      };

      const permission_one = await createPermission(repository, 1, {
        perm_id: 1,
        perm_name: 'Permission 01',
        perm_sub_dom_name: null,
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });
      const permission_two = await createPermission(repository, 2, {
        perm_id: 2,
        perm_name: 'Permission 02',
        perm_sub_dom_name: null,
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });

      const permissions = await repository.findByDomainName('Domain Name');

      expect(permissions.length).toBe(2);
      expect(permissions).toEqual([
        { ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) },
        { ...permission_two, created_at: expect.any(Date), updated_at: expect.any(Date) }
      ]);
    });

    it('should not return a permission with domain different', async () => {
      await createPermission(repository, 4, {
        perm_id: 4,
        perm_name: 'Permission 04',
        perm_sub_dom_name: null,
        created_at: new Date(),
        updated_at: new Date(),
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name 02',
        perm_system_name: 'System Name'
      });

      const permissions = await repository.findByDomainName('Domain Name');

      expect(permissions.length).toBe(0);
      expect(permissions).toEqual([]);
    });
  });

  describe('findBySubDomainName', () => {
    it('should return permissions by sub domain name', async () => {
      const permission_domain: OmitBaseDto<PermissionDomainDto> = {
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      };

      const permission_one = await createPermission(repository, 1, {
        perm_id: 1,
        perm_name: 'Permission 01',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });
      const permission_two = await createPermission(repository, 2, {
        perm_id: 2,
        perm_name: 'Permission 02',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });

      const permissions = await repository.findBySubDomainName('Sub Domain 01');

      expect(permissions.length).toBe(2);
      expect(permissions).toEqual([
        { ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) },
        { ...permission_two, created_at: expect.any(Date), updated_at: expect.any(Date) }
      ]);
    });

    it('should not return a permission with sub domain different', async () => {
      await createPermission(repository, 4, {
        perm_id: 4,
        perm_name: 'Permission 04',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name 02',
        perm_system_name: 'System Name'
      });

      const permissions = await repository.findByDomainName('Sub Domain 02');

      expect(permissions.length).toBe(0);
      expect(permissions).toEqual([]);
    });
  });

  describe('findAllSubdomainsByDomainId', () => {
    it('should return all subdomains one time each for the given domain id', async () => {
      const permission_domain: OmitBaseDto<PermissionDomainDto> = {
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      };

      const another_permission_domain: OmitBaseDto<PermissionDomainDto> = {
        perm_dom_id: 2,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      };

      const permission_one = await createPermission(repository, 1, {
        perm_id: 1,
        perm_name: 'Permission 01',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });
      const permission_two = await createPermission(repository, 2, {
        perm_id: 2,
        perm_name: 'Permission 02',
        perm_sub_dom_name: 'Sub Domain 02',
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });
      await createPermission(repository, 1, {
        perm_id: 3,
        perm_name: 'Permission 03',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        ...permission_domain
      });
      await createPermission(repository, 1, {
        perm_id: 4,
        perm_name: 'Permission 04',
        perm_sub_dom_name: 'Sub Domain 01',
        created_at: new Date(),
        updated_at: new Date(),
        ...another_permission_domain
      });

      const subDomains = await repository.findAllSubDomainsByDomainId(1);

      expect(subDomains).toEqual([
        { ...permission_one, created_at: expect.any(Date), updated_at: expect.any(Date) },
        { ...permission_two, created_at: expect.any(Date), updated_at: expect.any(Date) }
      ]);
    });
  });

  describe('findByName', () => {
    it('should find permission by name', async () => {
      await createPermission(repository, 1, {
        perm_id: 1,
        perm_name: 'Perm 01',
        perm_sub_dom_name: null,
        created_at: new Date(),
        updated_at: new Date(),
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      });

      const permission = await repository.findByName('Perm 01');

      expect(permission).toEqual({
        perm_id: 1,
        perm_name: 'Perm 01',
        perm_sub_dom_name: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: 1,
        perm_dom_name: 'Domain Name',
        perm_system_name: 'System Name'
      });
    });

    it('must throw error when entity not found', async () => {
      await expect(async () => repository.findByName('to throw error')).rejects.toThrowError(
        'Entidade não encontrada pelo(a) nome: to throw error'
      );
    });
  });
});
