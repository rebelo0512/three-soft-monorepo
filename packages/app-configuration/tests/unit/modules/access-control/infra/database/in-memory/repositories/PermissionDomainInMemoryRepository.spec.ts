import {
  IPermissionDomainRepository,
  PermissionDomainDto,
  PermissionDomainInMemoryRepository
} from '../../../../../../../../src';
import { createPermissionDomain } from '../../../../../../../helpers';

describe('PermissionDomainInMemoryRepository Unit Tests', () => {
  let repository: IPermissionDomainRepository;

  beforeEach(() => {
    repository = new PermissionDomainInMemoryRepository();
  });

  describe('findAllSystems', () => {
    it('must return all systems without duplicate', async () => {
      await createPermissionDomain(repository, 1, {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      await createPermissionDomain(repository, 1, {
        perm_dom_id: 2,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 02',
        created_at: new Date(),
        updated_at: new Date()
      });

      await createPermissionDomain(repository, 1, {
        perm_dom_id: 3,
        perm_system_name: 'System 02',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      const systems = await repository.findAllSystems();

      expect(systems.length).toEqual(2);
      expect(systems).toEqual([
        {
          perm_system_name: 'System 01'
        },
        {
          perm_system_name: 'System 02'
        }
      ]);
    });
  });

  describe('findById', () => {
    it('must return a valid entity by id', async () => {
      const domain = await createPermissionDomain(repository, 1, {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      const domainCreated = await repository.findById(domain.perm_dom_id);

      expect(domainCreated.perm_dom_id).toEqual(domain.perm_dom_id);
      expect(domainCreated).toEqual({
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must throw error when entity not found', async () => {
      await expect(async () => repository.findById(0)).rejects.toThrowError('Entidade não encontrada pelo(a) id: 0');
    });
  });

  describe('findByName', () => {
    it('must return a valid entity by name', async () => {
      const domain = await createPermissionDomain(repository, 1, {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      const domainCreated = await repository.findByName(domain.perm_dom_name);

      expect(domainCreated.perm_dom_id).toEqual(domain.perm_dom_id);
      expect(domainCreated).toEqual({
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must throw error when entity not found', async () => {
      await expect(async () => repository.findByName('to throw error')).rejects.toThrowError(
        'Entidade não encontrada pelo(a) nome: to throw error'
      );
    });
  });

  describe('findBySystemNameAndName', () => {
    it('must return a valid entity by system name and name', async () => {
      const domain = await createPermissionDomain(repository, 1, {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      const domainCreated = await repository.findBySystemNameAndName({
        system_name: domain.perm_system_name,
        name: domain.perm_dom_name
      });

      expect(domainCreated.perm_dom_id).toEqual(domain.perm_dom_id);
      expect(domainCreated).toEqual({
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must throw error when entity not found', async () => {
      await expect(async () =>
        repository.findBySystemNameAndName({
          system_name: 'to throw error',
          name: 'to throw error'
        })
      ).rejects.toThrowError('Entidade não encontrada pelo(a) nome: to throw error');
    });
  });

  describe('findAllDomainBySystemName', () => {
    it('must return all domains based on system name', async () => {
      await createPermissionDomain(repository, 1, {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      await createPermissionDomain(repository, 1, {
        perm_dom_id: 2,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 02',
        created_at: new Date(),
        updated_at: new Date()
      });

      await createPermissionDomain(repository, 1, {
        perm_dom_id: 3,
        perm_system_name: 'System 02',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      });

      const systems = await repository.findAllDomainBySystemName('System 01');

      expect(systems.length).toEqual(2);
      expect(systems).toEqual([
        {
          perm_dom_id: 1,
          perm_system_name: 'System 01',
          perm_dom_name: 'Domain 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          perm_dom_id: 2,
          perm_system_name: 'System 01',
          perm_dom_name: 'Domain 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('create', () => {
    it('must create a new entity with all props', async () => {
      const domain: PermissionDomainDto = {
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      };

      const domainCreated = await repository.create(domain);

      expect(domainCreated).toEqual({
        perm_dom_id: 1,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });
});
