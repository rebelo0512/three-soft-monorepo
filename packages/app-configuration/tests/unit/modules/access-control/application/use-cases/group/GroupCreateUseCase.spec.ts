import {
  GroupCreateInputDto,
  GroupCreateUseCase,
  GroupInMemoryRepository,
  IGroupRepository
} from '../../../../../../../src';

describe('GroupCreateUseCase Unit Tests', () => {
  let groupRepository: IGroupRepository;
  let groupCreateUseCase: GroupCreateUseCase;

  beforeEach(() => {
    groupRepository = new GroupInMemoryRepository();
    groupCreateUseCase = new GroupCreateUseCase(groupRepository);
  });

  it('should create a new group', async () => {
    const input: GroupCreateInputDto = {
      name: 'Group 01'
    };

    const groupCreated = await groupCreateUseCase.execute(input);

    expect(groupCreated).toEqual({
      group_id: 1,
      group_name: 'Group 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error when name is invalid', async () => {
    const arrayToThrow = [
      {
        value: [],
        message: 'Error: name must be a `string` type, but the final value was: `[]`.'
      },
      {
        value: null,
        message: ''
      },
      {
        value: undefined,
        message: ''
      }
    ];

    const promises = arrayToThrow.map(async ({ value, message }) => {
      await expect(async () => groupCreateUseCase.execute({ name: value as never })).rejects.toThrowError(message);
    });

    await Promise.all(promises);
  });
});
