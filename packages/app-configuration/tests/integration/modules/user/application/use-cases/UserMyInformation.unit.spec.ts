import { DatabaseMysqlConnection, encodeToken } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserMyInformationUseCase,
  UserMysqlRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser } from '../../../../../helpers';

describe('UserMyInformationUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let myInformationUseCase: UserMyInformationUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    myInformationUseCase = new UserMyInformationUseCase(repository);
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

    const token = encodeToken({ user_id: user_created.user_id, group_id: group.group_id });

    const user = await myInformationUseCase.execute({ token });

    expect(user).toEqual(user_created);
  });

  it('should throw error if user is not found', async () => {
    const token = encodeToken({ user_id: 0, group_id: 1 });

    await expect(() =>
      myInformationUseCase.execute({
        token
      })
    ).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
  });
});
