import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { cleanCompanyDB, createCompanies, createCompany, ICompanyRepository } from '@three-soft/pkg-configuration';
import { CompanyController } from '../../../../../../../src/modules';
import { createCompanyModule } from '../../../../../../helpers';

describe('CompanyController Integration Tests', () => {
  let controller: CompanyController;
  let repository: ICompanyRepository;

  beforeAll(async () => {
    const moduleRef = await createCompanyModule();

    repository = moduleRef.get<ICompanyRepository>(ICompanyRepository.name);
    controller = moduleRef.get<CompanyController>(CompanyController);
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('must return a array of company', async () => {
      await createCompanies(repository, 3);

      const companies = await controller.findAll();

      expect(companies.length).toBe(3);
      expect(companies).toEqual([
        {
          comp_id: expect.any(Number),
          comp_name: 'Name 01',
          comp_cnpj: 'CNPJ 01',
          comp_vlan: 1,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          comp_id: expect.any(Number),
          comp_name: 'Name 02',
          comp_cnpj: 'CNPJ 02',
          comp_vlan: 2,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          comp_id: expect.any(Number),
          comp_name: 'Name 03',
          comp_cnpj: 'CNPJ 03',
          comp_vlan: 3,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return a empty array of company', async () => {
      const companies = await controller.findAll();

      expect(companies.length).toBe(0);
      expect(companies).toEqual([]);
    });
  });

  describe('findById', () => {
    it('must return a company by id', async () => {
      const company_created = await createCompany(repository);

      const company = await controller.findById(company_created.comp_id);

      expect(company).toEqual(company_created);
    });

    it('must return a empty array of company', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Empresa não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('must create a company', async () => {
      const company = await controller.create({ name: 'Name Created', cnpj: 'CNPJ Created', vlan: 4389 });

      expect(company).toEqual({
        comp_id: expect.any(Number),
        comp_name: 'Name Created',
        comp_cnpj: 'CNPJ Created',
        comp_vlan: 4389,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('must update required props of a category', async () => {
      const company = await createCompany(repository);

      const company_updated = await controller.update(company.comp_id, {
        id: company.comp_id,
        name: 'Name Updated',
        vlan: 512,
        cnpj: 'CNPJ Updated'
      });

      expect(company_updated).toEqual({
        ...company,
        comp_name: 'Name Updated',
        comp_vlan: 512,
        comp_cnpj: 'CNPJ Updated',
        updated_at: expect.any(Date)
      });
    });

    it('must return a empty array of company', async () => {
      const id_wrong = Math.floor(Math.random() * 1000);

      await expect(() =>
        controller.update(id_wrong, {
          id: id_wrong,
          name: 'Name Updated',
          vlan: 512,
          cnpj: 'CNPJ Updated'
        })
      ).rejects.toThrowError(`Empresa não encontrada pelo(a) id: ${id_wrong}`);
    });
  });
});
