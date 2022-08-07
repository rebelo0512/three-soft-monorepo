import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { GroupCreateUseCase, GroupMysqlRepository, IGroupRepository } from '../../../../../../../src';
import { cleanGroupDB } from '../../../../../../helpers';

describe('GroupCreateUseCase Integration Tests', () => {
  let repository: IGroupRepository;
  let createUseCase: GroupCreateUseCase;

  beforeAll(async () => {
    repository = new GroupMysqlRepository();
    createUseCase = new GroupCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanGroupDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a group', async () => {
    const group = await createUseCase.execute({ name: 'Group 01' });

    expect(group).toEqual({
      group_id: expect.any(Number),
      group_name: 'Group 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
