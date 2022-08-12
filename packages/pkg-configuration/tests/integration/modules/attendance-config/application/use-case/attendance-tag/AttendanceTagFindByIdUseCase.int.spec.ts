import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  IAttendanceTagRepository,
  AttendanceTagFindByIdUseCase,
  AttendanceTagMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTag } from '../../../../../../helpers';

describe('AttendanceTagFindByIdUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let findByIdUseCase: AttendanceTagFindByIdUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    findByIdUseCase = new AttendanceTagFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return tag by id', async () => {
    const tag_created = await createAttendanceTag(repository);

    const tag = await findByIdUseCase.execute({ id: tag_created.att_tag_id });

    expect(tag).toEqual(tag_created);
  });

  it('should throw error if tag is not found', async () => {
    await expect(() =>
      findByIdUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Tag não encontrada pelo(a) id: 0');
  });
});
