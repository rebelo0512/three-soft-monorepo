import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { cleanPermissionDB, createPermission, createPermissionDomain } from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionFindAllBySubDomainUseCase,
  PermissionDomainMysqlRepository,
  PermissionMysqlRepository
} from '../../../../../../../src';

describe('PermissionFindAllBySubDomainUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IPermissionRepository;
  let findAllBySubDomainUseCase: PermissionFindAllBySubDomainUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new PermissionMysqlRepository();
    findAllBySubDomainUseCase = new PermissionFindAllBySubDomainUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all permissions by sub domain', async () => {
    const domain = await createPermissionDomain(permissionDomainRepository);

    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 01', sub_domain: 'Sub 01' });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 02', sub_domain: 'Sub 01' });
    await createPermission(repository, domain.perm_dom_id, { name: 'Perm 03', sub_domain: 'Sub 02' });

    const permissions = await findAllBySubDomainUseCase.execute({
      sub_dom: 'Sub 01'
    });

    expect(permissions.length).toBe(2);
    expect(permissions).toEqual([
      {
        perm_id: expect.any(Number),
        perm_name: 'Perm 01',
        perm_sub_dom_name: 'Sub 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: domain.perm_dom_id,
        perm_system_name: domain.perm_system_name,
        perm_dom_name: domain.perm_dom_name
      },
      {
        perm_id: expect.any(Number),
        perm_name: 'Perm 02',
        perm_sub_dom_name: 'Sub 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
        perm_dom_id: domain.perm_dom_id,
        perm_system_name: domain.perm_system_name,
        perm_dom_name: domain.perm_dom_name
      }
    ]);
  });
});
