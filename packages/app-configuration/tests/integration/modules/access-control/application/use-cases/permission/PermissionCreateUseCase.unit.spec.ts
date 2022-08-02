import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import { cleanPermissionDB, createPermissionDomain } from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionCreateUseCase,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository
} from '../../../../../../../src';

describe('PermissionCreateUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;
  let createUseCase: PermissionCreateUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
    createUseCase = new PermissionCreateUseCase(repository, permissionDomainRepository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a permission', async () => {
    const domain = await createPermissionDomain(permissionDomainRepository);

    const permission = await createUseCase.execute({
      system_name: domain.perm_system_name,
      domain: domain.perm_dom_name,
      name: 'Permission 01',
      sub_domain: null
    });

    expect(permission).toEqual({
      perm_id: expect.any(Number),
      perm_name: 'Permission 01',
      perm_sub_dom_name: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      perm_dom_id: domain.perm_dom_id,
      perm_system_name: domain.perm_system_name,
      perm_dom_name: domain.perm_dom_name
    });
  });

  it('should throw error when permission domain not found', async () => {
    const string_error = generateString(25);

    await expect(async () =>
      createUseCase.execute({
        system_name: string_error,
        domain: string_error,
        name: 'Permission 01',
        sub_domain: null
      })
    ).rejects.toThrowError(`Entidade não encontrada pelo(a) nome: ${string_error}`);
  });
});
