import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { cleanPermissionDB, createPermissionDomain } from '../../../../../../helpers';
import {
  IPermissionDomainRepository,
  PermissionFindAllSystemsUseCase,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';

describe('PermissionFindAllSystemsUseCase Integration Tests', () => {
  let repository: IPermissionDomainRepository;
  let findAllBySystemNameUseCase: PermissionFindAllSystemsUseCase;

  beforeAll(async () => {
    repository = new PermissionDomainMysqlRepository();
    findAllBySystemNameUseCase = new PermissionFindAllSystemsUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPermissionDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all systems', async () => {
    await createPermissionDomain(repository, {
      system_name: 'System 01',
      name: 'Name 01'
    });
    await createPermissionDomain(repository, {
      system_name: 'System 01',
      name: 'Name 02'
    });
    await createPermissionDomain(repository, {
      system_name: 'System 02',
      name: 'Name 01'
    });

    const domains = await findAllBySystemNameUseCase.execute();

    expect(domains.length).toBe(2);
    expect(domains).toEqual([
      {
        perm_system_name: 'System 01'
      },
      {
        perm_system_name: 'System 02'
      }
    ]);
  });
});
