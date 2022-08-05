import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserFindByIdUseCase,
  UserMysqlRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser } from '../../../../../helpers';

describe('UserFindByIdUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let findByIdUseCase: UserFindByIdUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    findByIdUseCase = new UserFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return user by id', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    const user = await findByIdUseCase.execute({ id: user_created.user_id });

    expect(user).toEqual(user_created);
  });

  it('should throw error if user is not found', async () => {
    await expect(() =>
      findByIdUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
  });
});
