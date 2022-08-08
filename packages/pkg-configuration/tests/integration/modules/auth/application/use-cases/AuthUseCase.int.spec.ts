import { DatabaseMysqlConnection, generateString, hashString } from '@three-soft/core-backend';
import {
  IUserRepository,
  AuthUseCase,
  UserMysqlRepository,
  IGroupRepository,
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser } from '../../../../../helpers';

describe('AuthUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let authUseCase: AuthUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    authUseCase = new AuthUseCase(repository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should authenticate a user', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await repository.create({
      email: 'demo@demo.com',
      name: 'Demo',
      password: await hashString('123456'),
      company_id: company.comp_id,
      group_id: group.group_id
    });

    const response = await authUseCase.execute({
      email: user_created.user_email,
      password: '123456'
    });

    expect(response).toEqual({
      token: expect.any(String),
      user: {
        user_id: user_created.user_id,
        user_name: 'Demo',
        queues: []
      }
    });
  });

  it('should throw error when user not exist', async () => {
    await expect(() =>
      authUseCase.execute({
        email: 'to-throw-error@demo.com',
        password: '123'
      })
    ).rejects.toThrowError('Email ou senha incorretos');
  });

  it('should throw error when password is wrong', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    await expect(() =>
      authUseCase.execute({
        email: user_created.user_email,
        password: generateString(15)
      })
    ).rejects.toThrowError('Email ou senha incorretos');
  });

  it('should throw error when user is inactivated', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    await repository.update({
      id: user_created.user_id,
      email: user_created.user_email,
      group_id: group.group_id,
      name: user_created.user_name,
      password: user_created.user_password,
      status: false
    });

    await expect(() =>
      authUseCase.execute({
        email: user_created.user_email,
        password: '123'
      })
    ).rejects.toThrowError('Usuário inativo');
  });
});
