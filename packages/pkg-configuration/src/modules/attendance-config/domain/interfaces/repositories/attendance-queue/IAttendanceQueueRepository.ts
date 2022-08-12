import { IBaseRepository } from '@three-soft/core-backend';
import { AttendanceQueueDto } from '../../../dtos';
import {
  AttendanceQueueRepositoryCreateInput,
  AttendanceQueueRepositoryUpdateInput
} from './attendance-queue-repository';

/* c8 ignore start */
export abstract class IAttendanceQueueRepository extends IBaseRepository {
  abstract search(name: string | null): Promise<AttendanceQueueDto[]>;
  abstract findById(id: number): Promise<AttendanceQueueDto | null>;
  abstract findByTag(tag: string): Promise<AttendanceQueueDto | null>;
  abstract findByName(names: string): Promise<AttendanceQueueDto | null>;
  abstract create(input: AttendanceQueueRepositoryCreateInput): Promise<AttendanceQueueDto>;
  abstract update(input: AttendanceQueueRepositoryUpdateInput): Promise<AttendanceQueueDto>;
  abstract delete(queue: AttendanceQueueDto): Promise<void>;
}
/* c8 ignore stop */
