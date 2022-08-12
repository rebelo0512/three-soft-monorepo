import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceTagUpdateUseCase,
  AttendanceTagMysqlRepository,
  IAttendanceTagRepository
} from '../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTag } from '../../../../../../helpers';

describe('AttendanceTagUpdateUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let updateUseCase: AttendanceTagUpdateUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    updateUseCase = new AttendanceTagUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a tag', async () => {
    const tag = await createAttendanceTag(repository);

    const tag_updated = await updateUseCase.execute({
      id: tag.att_tag_id,
      name: 'AttendanceTag Updated'
    });

    expect(tag_updated).toEqual({
      att_tag_id: tag.att_tag_id,
      att_tag_name: 'AttendanceTag Updated',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if tag is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'AttendanceTag Updated'
      })
    ).rejects.toThrowError(`Tag não encontrada pelo(a) id: ${id_error}`);
  });
});
