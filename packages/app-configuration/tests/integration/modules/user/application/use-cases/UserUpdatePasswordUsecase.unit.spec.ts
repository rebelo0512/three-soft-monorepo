import { DatabaseMysqlConnection, hashComparedString } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserUpdatePasswordUseCase,
  UserMysqlRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser } from '../../../../../helpers';

describe('UserUpdatePasswordUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let updatePasswordUseCase: UserUpdatePasswordUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    updatePasswordUseCase = new UserUpdatePasswordUseCase(repository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update user password', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    const user = await updatePasswordUseCase.execute({
      id: user_created.user_id,
      password: 'Password 01'
    });

    const same_password = await hashComparedString(user.user_password, 'Password 01');

    expect(same_password).toBeTruthy();
  });

  it('should throw error if user not found', async () => {
    await expect(() =>
      updatePasswordUseCase.execute({
        id: 0,
        password: 'to throw error'
      })
    ).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
  });
});
