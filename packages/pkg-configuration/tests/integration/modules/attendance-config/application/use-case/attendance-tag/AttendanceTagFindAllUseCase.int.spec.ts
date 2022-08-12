import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceTagFindAllUseCase,
  AttendanceTagMysqlRepository,
  IAttendanceTagRepository
} from '../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTags } from '../../../../../../helpers';

describe('AttendanceTagFindAllUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let findAllUseCase: AttendanceTagFindAllUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    findAllUseCase = new AttendanceTagFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all tags', async () => {
    await createAttendanceTags(repository, 3);

    const tags = await findAllUseCase.execute();

    expect(tags.length).toBe(3);
    expect(tags).toEqual([
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Name 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Name 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Name 03',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
