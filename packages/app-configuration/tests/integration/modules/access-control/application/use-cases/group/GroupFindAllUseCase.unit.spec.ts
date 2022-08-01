import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { GroupFindAllUseCase, GroupMysqlRepository, IGroupRepository } from '../../../../../../../src';
import { cleanGroupDB, createGroups } from '../../../../../../helpers';

describe('GroupFindAllUseCase Integration Tests', () => {
  let repository: IGroupRepository;
  let findAllUseCase: GroupFindAllUseCase;

  beforeAll(async () => {
    repository = new GroupMysqlRepository();
    findAllUseCase = new GroupFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all groups', async () => {
    await createGroups(repository, 3);

    const groups = await findAllUseCase.execute();

    expect(groups.length).toBe(3);
    expect(groups).toEqual([
      {
        group_id: expect.any(Number),
        group_name: 'Name 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        group_id: expect.any(Number),
        group_name: 'Name 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        group_id: expect.any(Number),
        group_name: 'Name 03',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
