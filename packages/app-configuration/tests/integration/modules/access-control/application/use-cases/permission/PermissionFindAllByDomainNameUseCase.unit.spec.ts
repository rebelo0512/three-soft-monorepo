import { DatabaseMysqlConnection, generateString } from '@three-soft/core-backend';
import { cleanPermissionDB, createPermission, createPermissionDomain } from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionFindAllByDomainNameUseCase,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository
} from '../../../../../../../src';

describe('PermissionFindAllByDomainNameUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;
  let findAllByDomainNameUseCase: PermissionFindAllByDomainNameUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
    findAllByDomainNameUseCase = new PermissionFindAllByDomainNameUseCase(repository, permissionDomainRepository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all permissions by domain name and system name', async () => {
    const domain = await createPermissionDomain(permissionDomainRepository);

    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 01', sub_domain: null });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 02', sub_domain: null });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: null });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 04', sub_domain: 'Sub 01' });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 05', sub_domain: 'Sub 01' });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 06', sub_domain: 'Sub 02' });

    const result = await findAllByDomainNameUseCase.execute({
      system_name: domain.perm_system_name,
      domain_name: domain.perm_dom_name
    });

    expect(result.permissions.length).toBe(3);
    expect(result.sub_dom.length).toBe(2);
    expect(result).toEqual({
      permissions: [
        {
          perm_id: expect.any(Number),
          perm_name: 'Perm 01',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: domain.perm_dom_id,
          perm_system_name: domain.perm_system_name,
          perm_dom_name: domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Perm 02',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: domain.perm_dom_id,
          perm_system_name: domain.perm_system_name,
          perm_dom_name: domain.perm_dom_name
        },
        {
          perm_id: expect.any(Number),
          perm_name: 'Perm 03',
          perm_sub_dom_name: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: domain.perm_dom_id,
          perm_system_name: domain.perm_system_name,
          perm_dom_name: domain.perm_dom_name
        }
      ],
      sub_dom: [
        {
          perm_sub_dom_name: 'Sub 01'
        },
        {
          perm_sub_dom_name: 'Sub 02'
        }
      ]
    });
  });

  it('should throw error when permission domain not found', async () => {
    const string_error = generateString(25);

    await expect(async () =>
      findAllByDomainNameUseCase.execute({
        system_name: string_error,
        domain_name: string_error
      })
    ).rejects.toThrowError(`Entidade não encontrada pelo(a) nome: ${string_error}`);
  });
});
