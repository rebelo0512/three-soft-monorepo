import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  AttendanceQueueCreateUseCase,
  AttendanceQueueMysqlRepository,
  IAttendanceQueueRepository,
  IPermissionDomainRepository,
  PermissionDomainMysqlRepository
} from '../../../../../../../src';
import { cleanAttendanceQueueDB, createPermissionDomain } from '../../../../../../helpers';

describe('AttendanceQueueCreateUseCase Integration Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let repository: IAttendanceQueueRepository;
  let createUseCase: AttendanceQueueCreateUseCase;

  beforeAll(async () => {
    permissionDomainRepository = new PermissionDomainMysqlRepository();
    repository = new AttendanceQueueMysqlRepository();
    createUseCase = new AttendanceQueueCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanAttendanceQueueDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a queue ', async () => {
    await createPermissionDomain(permissionDomainRepository, {
      system_name: 'FIBER_THREE',
      name: 'LIBERACAO'
    });

    const queue = await createUseCase.execute({ name: 'AttendanceQueue 01', color: 'Color 01', tag: 'Tag 01' });

    expect(queue).toEqual({
      queue_id: expect.any(Number),
      queue_name: 'AttendanceQueue 01',
      queue_color: 'Color 01',
      queue_tag: 'Tag 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
