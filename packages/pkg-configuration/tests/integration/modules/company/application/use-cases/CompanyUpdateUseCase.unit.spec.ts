import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CompanyUpdateUseCase, CompanyMysqlRepository, ICompanyRepository } from '../../../../../../src';
import { cleanCompanyDB, createCompany } from '../../../../../helpers';

describe('CompanyUpdateUseCase Integration Tests', () => {
  let repository: ICompanyRepository;
  let updateUseCase: CompanyUpdateUseCase;

  beforeAll(async () => {
    repository = new CompanyMysqlRepository();
    updateUseCase = new CompanyUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a company', async () => {
    const company = await createCompany(repository);

    const company_updated = await updateUseCase.execute({
      id: company.comp_id,
      name: 'Company Updated',
      cnpj: 'CNPJ Updated',
      vlan: 762
    });

    expect(company_updated).toEqual({
      comp_id: expect.any(Number),
      comp_name: 'Company Updated',
      comp_vlan: 762,
      comp_cnpj: 'CNPJ Updated',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if company is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'Company Updated',
        cnpj: 'CNPJ Updated',
        vlan: 762
      })
    ).rejects.toThrowError(`Empresa não encontrada pelo(a) id: ${id_error}`);
  });
});
