import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CompanyCreateUseCase, CompanyMysqlRepository, ICompanyRepository } from '../../../../../../src';
import { cleanCompanyDB } from '../../../../../helpers';

describe('CompanyCreateUseCase Integration Tests', () => {
  let repository: ICompanyRepository;
  let createUseCase: CompanyCreateUseCase;

  beforeAll(async () => {
    repository = new CompanyMysqlRepository();
    createUseCase = new CompanyCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a company', async () => {
    const company = await createUseCase.execute({ name: 'Company 01', cnpj: 'CNPJ 01', vlan: 762 });

    expect(company).toEqual({
      comp_id: expect.any(Number),
      comp_name: 'Company 01',
      comp_vlan: 762,
      comp_cnpj: 'CNPJ 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
