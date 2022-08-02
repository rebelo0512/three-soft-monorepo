import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { cleanPermissionDB, createPermissionDomain } from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  PermissionFindAllDomainsBySystemNameUseCase,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';

describe('PermissionFindAllDomainsBySystemNameUseCase Integration Tests', () => {
  let repository: IPermissionDomainRepository;
  let findAllBySystemNameUseCase: PermissionFindAllDomainsBySystemNameUseCase;

  beforeAll(async () => {
    repository = new PermissionDomainMysqlRepository();
    findAllBySystemNameUseCase = new PermissionFindAllDomainsBySystemNameUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all permission domains by system name', async () => {
    const domain_one = await createPermissionDomain(repository, {
      system_name: 'System 01',
      name: 'Name 01'
    });
    const domain_two = await createPermissionDomain(repository, {
      system_name: 'System 01',
      name: 'Name 02'
    });
    await createPermissionDomain(repository, {
      system_name: 'System 02',
      name: 'Name 01'
    });

    const domains = await findAllBySystemNameUseCase.execute({
      system_name: 'System 01'
    });

    expect(domains.length).toBe(2);
    expect(domains).toEqual([
      {
        perm_dom_id: domain_one.perm_dom_id,
        perm_system_name: domain_one.perm_system_name,
        perm_dom_name: domain_one.perm_dom_name,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        perm_dom_id: domain_two.perm_dom_id,
        perm_system_name: domain_two.perm_system_name,
        perm_dom_name: domain_two.perm_dom_name,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
