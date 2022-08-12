import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceTagDeleteUseCase,
  AttendanceTagMysqlRepository,
  IAttendanceTagRepository
} from '../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTag } from '../../../../../../helpers';

describe('AttendanceTagDeleteUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let deleteUseCase: AttendanceTagDeleteUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    deleteUseCase = new AttendanceTagDeleteUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should delete a tag', async () => {
    const tag = await createAttendanceTag(repository);

    const tag_created = await repository.findById(tag.att_tag_id);

    expect(tag_created).toEqual(tag);

    await deleteUseCase.execute({ id: tag.att_tag_id });

    const tag_deleted = await repository.findById(tag.att_tag_id);

    expect(tag_deleted).toBeNull();
  });

  it('should throw error if tag is not found', async () => {
    await expect(() =>
      deleteUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Tag não encontrada pelo(a) id: 0');
  });
});
