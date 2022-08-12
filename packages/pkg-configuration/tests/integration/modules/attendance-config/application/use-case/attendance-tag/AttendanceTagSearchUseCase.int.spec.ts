import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IAttendanceTagRepository,
  AttendanceTagMysqlRepository,
  AttendanceTagSearchUseCase
} from '../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTag } from '../../../../../../helpers';

describe('AttendanceTagSearchUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let searchUseCase: AttendanceTagSearchUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    searchUseCase = new AttendanceTagSearchUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all tags filtered by name', async () => {
    await createAttendanceTag(repository, 'Tag 01');
    await createAttendanceTag(repository, 'Tag 02');
    await createAttendanceTag(repository, 'Tag 11');

    const tags = await searchUseCase.execute({ name: 'Tag 0' });

    expect(tags.length).toBe(2);
    expect(tags).toEqual([
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);

    const tags_two = await searchUseCase.execute({ name: 'Tag 11' });

    expect(tags_two.length).toBe(1);
    expect(tags_two).toEqual([
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 11',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should return all tags if no name is provided', async () => {
    await createAttendanceTag(repository, 'Tag 01');
    await createAttendanceTag(repository, 'Tag 02');
    await createAttendanceTag(repository, 'Tag 11');

    const tags = await searchUseCase.execute({ name: null });

    expect(tags.length).toBe(3);
    expect(tags).toEqual([
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 02',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 11',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
