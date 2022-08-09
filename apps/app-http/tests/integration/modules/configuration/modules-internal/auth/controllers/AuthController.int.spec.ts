import { DatabaseMysqlConnection, generateString, hashString } from '@three-soft/core-backend';
import {
  cleanUserDB,
  createCompany,
  createGroup,
  createUser,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository
} from '@three-soft/pkg-configuration';
import { AuthController } from '../../../../../../../src/modules';
import { createAuthModule } from '../../../../../../helpers';

describe('AuthController Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let controller: AuthController;

  beforeAll(async () => {
    const moduleRef = await createAuthModule();

    groupRepository = moduleRef.get<IGroupRepository>(IGroupRepository.name);
    companyRepository = moduleRef.get<ICompanyRepository>(ICompanyRepository.name);
    repository = moduleRef.get<IUserRepository>(IUserRepository.name);
    controller = moduleRef.get<AuthController>(AuthController);
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

    const response = await controller.auth({
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
      controller.auth({
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
      controller.auth({
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
      controller.auth({
        email: user_created.user_email,
        password: '123'
      })
    ).rejects.toThrowError('Usuário inativo');
  });
});
