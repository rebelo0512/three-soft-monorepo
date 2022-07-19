import { GroupInMemoryRepository, GroupSearchUseCase, IGroupRepository } from '../../../../../../../src';
import { createGroups } from '../../../../../../helpers';

describe('GroupSearchUseCase Unit Tests', () => {
  let groupRepository: IGroupRepository;
  let groupSearchUseCase: GroupSearchUseCase;

  beforeEach(() => {
    groupRepository = new GroupInMemoryRepository();
    groupSearchUseCase = new GroupSearchUseCase(groupRepository);
  });

  it('should filter groups by word "Name 02"', async () => {
    await createGroups(groupRepository, 3);

    const groups = await groupSearchUseCase.execute({ name: 'Name 02' });

    expect(groups.length).toEqual(1);
    expect(groups).toEqual([
      {
        group_id: 2,
        group_name: 'Name 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should return all if no filter is provided', async () => {
    await createGroups(groupRepository, 3);

    const groups = await groupSearchUseCase.execute({ name: '' });

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
});
