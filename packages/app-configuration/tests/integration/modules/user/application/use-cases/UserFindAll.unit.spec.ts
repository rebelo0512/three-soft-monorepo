import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserFindAllUseCase,
  UserMysqlRepository
} from '../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUsers } from '../../../../../helpers';

describe('UserFindAllUseCase Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;
  let findAllUseCase: UserFindAllUseCase;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
    findAllUseCase = new UserFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all users', async () => {
    const group = await createGroup(groupRepository);
    const company = await createCompany(companyRepository);

    await createUsers(repository, 3, { company_id: company.comp_id, group_id: group.group_id });

    const users = await findAllUseCase.execute();

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
});
