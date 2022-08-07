import { DatabaseMysqlConnection, hashComparedString } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserUpdateUseCase,
  UserMysqlRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser } from '../../../../../helpers';

describe('UserUpdateUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let updateUseCase: UserUpdateUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    updateUseCase = new UserUpdateUseCase(repository, groupRepository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a user but not password', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);
    const group_another = await createGroup(groupRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    const user = await updateUseCase.execute({
      id: user_created.user_id,
      email: 'email-updated@demo.com',
      group: group_another.group_name,
      name: 'Name Updated',
      password: null,
      status: false
    });

    expect(user).toEqual({
      user_id: expect.any(Number),
      user_name: 'Name Updated',
      user_email: 'email-updated@demo.com',
      user_password: user_created.user_password,
      user_status: 0,
      user_technical: 0,
      user_last_token: null,
      user_group_id: group_another.group_id,
      user_comp_id: company.comp_id,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      user_mobile_token: null,
      group_id: group_another.group_id,
      group_name: group_another.group_name,
      comp_id: company.comp_id,
      comp_name: company.comp_name,
      comp_cnpj: company.comp_cnpj,
      comp_vlan: company.comp_vlan
    });
  });

  it('should update a user and password', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);
    const group_another = await createGroup(groupRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    const user = await updateUseCase.execute({
      id: user_created.user_id,
      email: 'email-updated@demo.com',
      group: group_another.group_name,
      name: 'Name Updated',
      password: 'Password 01',
      status: false
    });

    const same_password = await hashComparedString(user.user_password, 'Password 01');

    expect(same_password).toBeTruthy();
  });

  it('should throw error if group not found', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

    await expect(() =>
      updateUseCase.execute({
        id: user_created.user_id,
        email: 'demo@demo.com',
        group: 'to throw error',
        name: 'name',
        password: null,
        status: true
      })
    ).rejects.toThrowError('Grupo não encontrada pelo(a) nome: to throw error');
  });

  it('should throw error if user not found', async () => {
    await expect(() =>
      updateUseCase.execute({
        id: 0,
        email: 'demo@demo.com',
        group: 'group',
        name: 'name',
        password: null,
        status: true
      })
    ).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
  });
});
