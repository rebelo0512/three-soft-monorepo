import { IBaseRepository } from '@three-soft/core-backend';
import { AttendanceTagDto } from '../../../dtos';
import { AttendanceTagRepositoryUpdateInput } from './attendance-tag-repository';

/* c8 ignore start */
export abstract class IAttendanceTagRepository extends IBaseRepository {
  abstract findAll(): Promise<AttendanceTagDto[]>;
  abstract search(name: string | null): Promise<AttendanceTagDto[]>;
  abstract findById(id: number): Promise<AttendanceTagDto | null>;
  abstract create(name: string): Promise<AttendanceTagDto>;
  abstract update(input: AttendanceTagRepositoryUpdateInput): Promise<AttendanceTagDto>;
  abstract delete(id: number): Promise<void>;
}
/* c8 ignore stop */
