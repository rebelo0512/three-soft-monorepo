import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceTagCreateUseCase,
  AttendanceTagMysqlRepository,
  IAttendanceTagRepository
} from '../../../../../../../src';
import { cleanAttendanceTagDB } from '../../../../../../helpers';

describe('AttendanceTagCreateUseCase Integration Tests', () => {
  let repository: IAttendanceTagRepository;
  let createUseCase: AttendanceTagCreateUseCase;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
    createUseCase = new AttendanceTagCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a tag ', async () => {
    const queue = await createUseCase.execute({ name: 'Tag 01' });

    expect(queue).toEqual({
      att_tag_id: expect.any(Number),
      att_tag_name: 'Tag 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
