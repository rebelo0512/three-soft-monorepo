import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { GroupSearchUseCase, GroupMysqlRepository, IGroupRepository } from '../../../../../../../src';
import { cleanGroupDB, createGroup } from '../../../../../../helpers';

describe('GroupSearchUseCase Integration Tests', () => {
  let repository: IGroupRepository;
  let searchUseCase: GroupSearchUseCase;

  beforeAll(async () => {
    repository = new GroupMysqlRepository();
    searchUseCase = new GroupSearchUseCase(repository);
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all groups based on name', async () => {
    await createGroup(repository, 'Group 01');
    await createGroup(repository, 'Group 02');
    await createGroup(repository, 'Group 11');

    const groups = await searchUseCase.execute({ name: 'Group 0' });

    expect(groups.length).toBe(2);
    expect(groups).toEqual([
      {
        group_id: expect.any(Number),
        group_name: 'Group 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        group_id: expect.any(Number),
        group_name: 'Group 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);

    const groups_two = await searchUseCase.execute({ name: 'Group 11' });

    expect(groups_two.length).toBe(1);
    expect(groups_two).toEqual([
      {
        group_id: expect.any(Number),
        group_name: 'Group 11',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
