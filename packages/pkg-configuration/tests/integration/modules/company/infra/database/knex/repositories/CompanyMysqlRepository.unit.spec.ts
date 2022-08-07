import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CompanyMysqlRepository, ICompanyRepository } from '../../../../../../../../src';
import { cleanCompanyDB, createCompanies, createCompany } from '../../../../../../../helpers';

describe('CompanyMysqlRepository Integration Tests', () => {
  let repository: ICompanyRepository;

  beforeAll(async () => {
    repository = new CompanyMysqlRepository();
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all companies', async () => {
      await createCompanies(repository, 3);

      const companies = await repository.findAll();

      expect(companies.length).toBe(3);
      expect(companies).toEqual([
        {
          comp_id: expect.any(Number),
          comp_cnpj: 'CNPJ 01',
          comp_name: 'Name 01',
          comp_vlan: 1,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          comp_id: expect.any(Number),
          comp_cnpj: 'CNPJ 02',
          comp_name: 'Name 02',
          comp_vlan: 2,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          comp_id: expect.any(Number),
          comp_cnpj: 'CNPJ 03',
          comp_name: 'Name 03',
          comp_vlan: 3,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findById', () => {
    it('should return company by id', async () => {
      const company = await createCompany(repository);

      const company_created = await repository.findById(company.comp_id);

      expect(company_created).toEqual(company);
    });

    it('should return null if id company not exist', async () => {
      const company = await repository.findById(0);

      expect(company).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return company by name', async () => {
      const company = await createCompany(repository);

      const company_created = await repository.findByName(company.comp_name);

      expect(company_created).toEqual(company);
    });

    it('should return null if name company not exist', async () => {
      const company = await repository.findByName('');

      expect(company).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new company', async () => {
      const company_created = await repository.create({
        name: 'Name 01',
        cnpj: 'CNPJ',
        vlan: 25
      });

      expect(company_created).toEqual({
        comp_id: expect.any(Number),
        comp_cnpj: 'CNPJ',
        comp_name: 'Name 01',
        comp_vlan: 25,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = await createCompany(repository);

      const company_updated = await repository.update({
        id: company.comp_id,
        name: 'Name 01',
        cnpj: 'CNPJ',
        vlan: 25
      });

      expect(company_updated).toEqual({
        comp_id: company.comp_id,
        comp_cnpj: 'CNPJ',
        comp_name: 'Name 01',
        comp_vlan: 25,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });
});
