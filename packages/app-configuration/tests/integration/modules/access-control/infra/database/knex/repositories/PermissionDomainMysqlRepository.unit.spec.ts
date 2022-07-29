import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { PermissionDomainDto, PermissionDomainMysqlRepository } from '../../../../../../../../src';
import { cleanPermissionDomainDB, createPermissionDomain, createPermissionDomains } from '../../../../../../../helpers';

const repository = new PermissionDomainMysqlRepository();

describe('PermissionDomainMysqlRepository Integration Tests', () => {
  beforeEach(async () => {
    await cleanPermissionDomainDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAllSystems', () => {
    it('should return all systems', async () => {
      await createPermissionDomains(repository, 3);

      const systems = await repository.findAllSystems();

      expect(systems).toEqual([
        { perm_system_name: 'System 01' },
        { perm_system_name: 'System 02' },
        { perm_system_name: 'System 03' }
      ]);
    });

    it('should return empty array if there are no systems', async () => {
      const systems = await repository.findAllSystems();

      expect(systems).toEqual([]);
    });
  });

  describe('findAllDomainBySystemName', () => {
    it('should return domain by system name', async () => {
      const domain_one = await createPermissionDomain(repository, 1);
      const domain_two = await createPermissionDomain(repository, 2, {
        perm_dom_id: 2,
        perm_dom_name: 'Domain 02',
        perm_system_name: domain_one.perm_system_name,
        created_at: new Date(),
        updated_at: new Date()
      });
      await createPermissionDomain(repository, 2, {
        perm_dom_id: 3,
        perm_dom_name: 'Domain 03',
        perm_system_name: 'System 02',
        created_at: new Date(),
        updated_at: new Date()
      });

      const domains = await repository.findAllDomainBySystemName(domain_one.perm_system_name);

      expect(domains.length).toBe(2);
      expect(domains).toEqual([
        { ...domain_one, perm_dom_id: expect.any(Number), created_at: expect.any(Date), updated_at: expect.any(Date) },
        { ...domain_two, perm_dom_id: expect.any(Number), created_at: expect.any(Date), updated_at: expect.any(Date) }
      ]);
    });
  });

  describe('findById', () => {
    it('should return domain by id', async () => {
      const domain_one = await createPermissionDomain(repository, 1);

      const domain = await repository.findById(domain_one.perm_dom_id);

      expect(domain).toEqual({
        ...domain_one,
        perm_dom_id: expect.any(Number),
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return null if id domain not exist', async () => {
      const domain = await repository.findById(0);

      expect(domain).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return domain by name', async () => {
      const domain_one = await createPermissionDomain(repository, 1);

      const domain = await repository.findByName(domain_one.perm_dom_name);

      expect(domain).toEqual({
        ...domain_one,
        perm_dom_id: expect.any(Number),
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return null if domain name not exist', async () => {
      const domain = await repository.findByName('not exist');

      expect(domain).toBeNull();
    });
  });

  describe('findBySystemNameAndName', () => {
    it('should return domain by name', async () => {
      const domain_one = await createPermissionDomain(repository, 1);

      const domain = await repository.findBySystemNameAndName({
        name: domain_one.perm_dom_name,
        system_name: domain_one.perm_system_name
      });

      expect(domain).toEqual({
        ...domain_one,
        perm_dom_id: expect.any(Number),
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should return null if domain name or system name not exist', async () => {
      const domain = await repository.findBySystemNameAndName({ name: 'not exist', system_name: 'not exist' });

      expect(domain).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a domain', async () => {
      const domain_one: PermissionDomainDto = {
        perm_dom_id: 0,
        perm_system_name: 'System 01',
        perm_dom_name: 'Domain 01',
        created_at: new Date(),
        updated_at: new Date()
      };

      const domain = await repository.create(domain_one);

      expect(domain).toEqual({
        ...domain_one,
        perm_dom_id: expect.any(Number),
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });
});
