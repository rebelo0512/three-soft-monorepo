import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import {
  CompanyMysqlRepository,
  GroupMysqlRepository,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository,
  UserMysqlRepository
} from '../../../../../../../../src';
import { cleanUserDB, createCompany, createGroup, createUser, createUsers } from '../../../../../../../helpers';

describe('UserMysqlRepository Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let repository: IUserRepository;

  beforeAll(async () => {
    groupRepository = new GroupMysqlRepository();
    companyRepository = new CompanyMysqlRepository();
    repository = new UserMysqlRepository();
  });

  beforeEach(async () => {
    await cleanUserDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      await createUsers(repository, 3, { company_id: company.comp_id, group_id: group.group_id });

      const users = await repository.findAll();

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

  describe('search', () => {
    it('should return all users if no filter is provided', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      await createUsers(repository, 3, { company_id: company.comp_id, group_id: group.group_id });

      const users = await repository.search({ email: null, name: null });

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

      const users = await repository.search({ name: 'Name 11', email: null });

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

      const users = await repository.search({ email: 'CNPJ 11', name: null });

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

      const users = await repository.search({ name: 'Name 11', email: 'CNPJ 11' });

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

      const users = await repository.search({ name: generateString(10), email: generateString(10) });

      expect(users.length).toBe(0);
      expect(users).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_created = await repository.findById(user.user_id);

      expect(user_created).toEqual(user);
    });

    it('should return null if id user not exist', async () => {
      const user = await repository.findById(0);

      expect(user).toBeNull();
    });
  });

  describe('findByEmailOrName', () => {
    it('should return user by email', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_created = await repository.findByEmailOrName({ name: null, email: user.user_email });

      expect(user_created).toEqual(user);
    });

    it('should return user by name', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_created = await repository.findByEmailOrName({ name: user.user_name, email: null });

      expect(user_created).toEqual(user);
    });

    it('should return user by email and name', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_created = await repository.findByEmailOrName({ name: user.user_name, email: user.user_email });

      expect(user_created).toEqual(user);
    });

    it('should return null if email and name of user not exist', async () => {
      const user = await repository.findByEmailOrName({ email: generateString(255), name: generateString(255) });

      expect(user).toBeNull();
    });
  });

  describe('findByGroupId', () => {
    it('should return user by group id', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_created = await repository.findByGroupId(group.group_id);

      expect(user_created).toEqual(user);
    });

    it('should return null if group id user not exist', async () => {
      const user = await repository.findByGroupId(0);

      expect(user).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user_created = await repository.create({
        name: 'Name',
        email: 'demo@demo.com',
        password: 'Password',
        company_id: company.comp_id,
        group_id: group.group_id
      });

      expect(user_created).toEqual({
        user_id: expect.any(Number),
        user_name: 'Name',
        user_email: 'demo@demo.com',
        user_password: 'Password',
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
  });

  describe('update', () => {
    it('should update a user but not password prop', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_updated = await repository.update({
        id: user.user_id,
        name: 'Name Update',
        email: 'demo-updated@demo.com',
        status: false,
        group_id: group.group_id,
        password: null
      });

      expect(user_updated).toEqual({
        user_id: expect.any(Number),
        user_name: 'Name Update',
        user_email: 'demo-updated@demo.com',
        user_password: user.user_password,
        user_status: 0,
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

    it('should update a user and password prop', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_updated = await repository.update({
        id: user.user_id,
        name: 'Name Update',
        email: 'demo-updated@demo.com',
        status: false,
        group_id: group.group_id,
        password: 'Test 2'
      });

      expect(user_updated).toEqual({
        user_id: expect.any(Number),
        user_name: 'Name Update',
        user_email: 'demo-updated@demo.com',
        user_password: 'Test 2',
        user_status: 0,
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
  });

  describe('updatePassword', () => {
    it('should update a password of user', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_updated = await repository.updatePassword({
        id: user.user_id,
        password: 'Password updated'
      });

      expect(user_updated).toEqual({
        user_id: expect.any(Number),
        user_name: user.user_name,
        user_email: user.user_email,
        user_password: 'Password updated',
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
  });

  describe('updateLastToken', () => {
    it('should update a last token of user', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user_updated = await repository.updateLastToken({
        id: user.user_id,
        token: 'New Token'
      });

      expect(user_updated).toEqual({
        user_id: expect.any(Number),
        user_name: user.user_name,
        user_email: user.user_email,
        user_password: user.user_password,
        user_status: 1,
        user_technical: 0,
        user_last_token: 'New Token',
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
  });
});
