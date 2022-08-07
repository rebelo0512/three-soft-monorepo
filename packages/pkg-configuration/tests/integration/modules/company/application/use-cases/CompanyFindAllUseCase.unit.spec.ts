import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CompanyFindAllUseCase, CompanyMysqlRepository, ICompanyRepository } from '../../../../../../src';
import { cleanCompanyDB, createCompanies } from '../../../../../helpers';

describe('CompanyFindAllUseCase Integration Tests', () => {
  let repository: ICompanyRepository;
  let findAllUseCase: CompanyFindAllUseCase;

  beforeAll(async () => {
    repository = new CompanyMysqlRepository();
    findAllUseCase = new CompanyFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all companies', async () => {
    await createCompanies(repository, 3);

    const companies = await findAllUseCase.execute();

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
