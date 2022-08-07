import { DatabaseMysqlConnection, hashComparedString } from '@three-soft/core-backend';
import {
  UserMysqlRepository,
  IUserRepository,
  UserCreateUseCase,
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup } from '../../../../../helpers';

describe('UserCreateUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let createUseCase: UserCreateUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    createUseCase = new UserCreateUseCase(repository, groupRepository, companyRepository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a user', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUseCase.execute({
      name: 'Name',
      email: 'demo@demo.com',
      password: 'Password',
      company: company.comp_name,
      group: group.group_name
    });

    expect(user_created).toEqual({
      user_id: expect.any(Number),
      user_name: 'Name',
      user_email: 'demo@demo.com',
      user_password: expect.any(String),
      user_status: 1,
      user_technical: 0,
      user_last_token: null,
      user_group_id: group.group_id,
      user_comp_id: company.comp_id,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      user_mobile_token: null,
      group_id: group.group_id,
      group_name: group.group_name,
      comp_id: company.comp_id,
      comp_name: company.comp_name,
      comp_cnpj: company.comp_cnpj,
      comp_vlan: company.comp_vlan
    });
  });

  it('should hash the password and compare if was valid', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUseCase.execute({
      name: 'Name',
      email: 'demo@demo.com',
      password: 'Password',
      company: company.comp_name,
      group: group.group_name
    });

    const same_password = await hashComparedString(user_created.user_password, 'Password');

    expect(same_password).toBeTruthy();
  });

  it('should throw error if company is not found', async () => {
    const group = await createGroup(groupRepository);

    await expect(() =>
      createUseCase.execute({
        name: 'Name',
        email: 'demo@demo.com',
        password: 'Password',
        company: 'to throw error',
        group: group.group_name
      })
    ).rejects.toThrowError('Empresa não encontrada pelo(a) nome: to throw error');
  });

  it('should throw error if group is not found', async () => {
    const company = await createCompany(companyRepository);

    await expect(() =>
      createUseCase.execute({
        name: 'Name',
        email: 'demo@demo.com',
        password: 'Password',
        company: company.comp_name,
        group: 'to throw error'
      })
    ).rejects.toThrowError('Grupo não encontrada pelo(a) nome: to throw error');
  });
});
