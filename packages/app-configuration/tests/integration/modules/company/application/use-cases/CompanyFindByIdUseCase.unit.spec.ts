import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CompanyFindByIdUseCase, CompanyMysqlRepository, ICompanyRepository } from '../../../../../../src';
import { cleanCompanyDB, createCompany } from '../../../../../helpers';

describe('CompanyFindByIdUseCase Integration Tests', () => {
  let repository: ICompanyRepository;
  let findByIdUseCase: CompanyFindByIdUseCase;

  beforeAll(async () => {
    repository = new CompanyMysqlRepository();
    findByIdUseCase = new CompanyFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCompanyDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return company by id', async () => {
    const company = await createCompany(repository);

    const company_created = await findByIdUseCase.execute({ id: company.comp_id });

    expect(company_created).toEqual(company);
  });

  it('should throw error if company is not found', async () => {
    await expect(() => findByIdUseCase.execute({ id: 0 })).rejects.toThrowError('Empresa não encontrada pelo(a) id: 0');
  });
});
