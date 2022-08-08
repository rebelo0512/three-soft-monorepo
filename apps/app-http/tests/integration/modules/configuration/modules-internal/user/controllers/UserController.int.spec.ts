import { DatabaseMysqlConnection, encodeToken, generateString, hashComparedString } from '@three-soft/core-backend';
import {
  cleanUserDB,
  createCompany,
  createGroup,
  createUser,
  createUsers,
  ICompanyRepository,
  IGroupRepository,
  IUserRepository
} from '@three-soft/pkg-configuration';
import { UserController } from '../../../../../../../src/modules';
import { createUserModule } from '../../../../../../helpers';

describe('UserController Integration Tests', () => {
  let groupRepository: IGroupRepository;
  let companyRepository: ICompanyRepository;
  let controller: UserController;
  let repository: IUserRepository;

  beforeAll(async () => {
    const moduleRef = await createUserModule();

    groupRepository = moduleRef.get<IGroupRepository>(IGroupRepository.name);
    companyRepository = moduleRef.get<ICompanyRepository>(ICompanyRepository.name);
    repository = moduleRef.get<IUserRepository>(IUserRepository.name);
    controller = moduleRef.get<UserController>(UserController);
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

      const users = await controller.findAll();

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

      const users = await controller.search({ email: null, name: null });

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

      const users = await controller.search({ name: 'Name 11', email: null });

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

      const users = await controller.search({ email: 'CNPJ 11', name: null });

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

      const users = await controller.search({ name: 'Name 11', email: 'CNPJ 11' });

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

      const users = await controller.search({ name: generateString(10), email: generateString(10) });

      expect(users.length).toBe(0);
      expect(users).toEqual([]);
    });
  });

  describe('myInformation', () => {
    it('should return user by id', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const token = encodeToken({ user_id: user_created.user_id, group_id: group.group_id });

      const user = await controller.myInformation(token);

      expect(user).toEqual(user_created);
    });

    it('should throw error if user is not found', async () => {
      const token = encodeToken({ user_id: 0, group_id: 1 });

      await expect(() => controller.myInformation(token)).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
    });
  });

  describe('findById', () => {
    it('should return user by id', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user = await controller.findById(user_created.user_id);

      expect(user).toEqual(user_created);
    });

    it('should throw error if user is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user_created = await controller.create({
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

      const user_created = await controller.create({
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
        controller.create({
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
        controller.create({
          name: 'Name',
          email: 'demo@demo.com',
          password: 'Password',
          company: company.comp_name,
          group: 'to throw error'
        })
      ).rejects.toThrowError('Grupo não encontrada pelo(a) nome: to throw error');
    });
  });

  describe('update', () => {
    it('should update a user but not password', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);
      const group_another = await createGroup(groupRepository);

      const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user = await controller.update(user_created.user_id, {
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

      const user = await controller.update(user_created.user_id, {
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
        controller.update(user_created.user_id, {
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
        controller.update(0, {
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

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const group = await createGroup(groupRepository);
      const company = await createCompany(companyRepository);

      const user_created = await createUser(repository, { company_id: company.comp_id, group_id: group.group_id });

      const user = await controller.updatePassword(user_created.user_id, {
        id: user_created.user_id,
        password: 'Password 01'
      });

      const same_password = await hashComparedString(user.user_password, 'Password 01');

      expect(same_password).toBeTruthy();
    });

    it('should throw error if user not found', async () => {
      await expect(() =>
        controller.updatePassword(0, {
          id: 0,
          password: 'to throw error'
        })
      ).rejects.toThrowError('Usuário não encontrada pelo(a) id: 0');
    });
  });
});
