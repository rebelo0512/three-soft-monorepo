import { GroupFindAllUseCase, GroupInMemoryRepository, IGroupRepository } from '../../../../../../../src';
import { createGroups } from '../../../../../../helpers';

describe('GroupFindAllUseCase Unit Tests', () => {
  let groupRepository: IGroupRepository;
  let groupFindAllUseCase: GroupFindAllUseCase;

  beforeEach(() => {
    groupRepository = new GroupInMemoryRepository();
    groupFindAllUseCase = new GroupFindAllUseCase(groupRepository);
  });

  it('should return all groups', async () => {
    await createGroups(groupRepository, 3);

    const groups = await groupFindAllUseCase.execute();

    expect(groups.length).toEqual(3);
    expect(groups).toEqual([
      {
        group_id: 1,
        group_name: 'Name 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        group_id: 2,
        group_name: 'Name 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        group_id: 3,
        group_name: 'Name 03',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should return array empty if no groups created', async () => {
    const groups = await groupFindAllUseCase.execute();

    expect(groups.length).toEqual(0);
    expect(groups).toEqual([]);
  });
});
