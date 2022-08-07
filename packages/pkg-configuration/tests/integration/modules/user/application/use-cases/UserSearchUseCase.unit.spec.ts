import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserMysqlRepository,
  UserSearchUseCase
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUsers } from '../../../../../helpers';

describe('UserSearchUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let searchUseCase: UserSearchUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    searchUseCase = new UserSearchUseCase(repository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all users if no filter is provided', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 3, { company_id: company.comp_id, group_id: group.group_id });

    const users = await searchUseCase.execute({ email: null, name: null });

    expect(users.length).toBe(3);
    expect(users).toEqual([
      {
        user_id: expect.any(Number),
        user_name: 'Name 01',
        user_email: 'CNPJ 01',
        user_password: 'Password 01',
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
      },
      {
        user_id: expect.any(Number),
        user_name: 'Name 02',
        user_email: 'CNPJ 02',
        user_password: 'Password 02',
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
      },
      {
        user_id: expect.any(Number),
        user_name: 'Name 03',
        user_email: 'CNPJ 03',
        user_password: 'Password 03',
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
      }
    ]);
  });

  it('should filter users by name', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 11, { company_id: company.comp_id, group_id: group.group_id });

    const users = await searchUseCase.execute({ name: 'Name 11', email: null });

    expect(users.length).toBe(1);
    expect(users).toEqual([
      {
        user_id: expect.any(Number),
        user_name: 'Name 11',
        user_email: 'CNPJ 11',
        user_password: 'Password 11',
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
      }
    ]);
  });

  it('should filter users by email', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 11, { company_id: company.comp_id, group_id: group.group_id });

    const users = await searchUseCase.execute({ email: 'CNPJ 11', name: null });

    expect(users.length).toBe(1);
    expect(users).toEqual([
      {
        user_id: expect.any(Number),
        user_name: 'Name 11',
        user_email: 'CNPJ 11',
        user_password: 'Password 11',
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
      }
    ]);
  });

  it('should filter users by email and name', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 11, { company_id: company.comp_id, group_id: group.group_id });

    const users = await searchUseCase.execute({ name: 'Name 11', email: 'CNPJ 11' });

    expect(users.length).toBe(1);
    expect(users).toEqual([
      {
        user_id: expect.any(Number),
        user_name: 'Name 11',
        user_email: 'CNPJ 11',
        user_password: 'Password 11',
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
      }
    ]);
  });

  it('should return no user if no email and name not exist', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 11, { company_id: company.comp_id, group_id: group.group_id });

    const users = await searchUseCase.execute({ name: generateString(10), email: generateString(10) });

    expect(users.length).toBe(0);
    expect(users).toEqual([]);
  });
});
