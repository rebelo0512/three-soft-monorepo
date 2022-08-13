import { AttendanceHourDto } from '../../../dtos';
import { AttendanceHourRepositoryCreateInput, AttendanceHourRepositoryUpdateInput } from './attendance-hour-repository';

/* c8 ignore start */
export abstract class IAttendanceHourRepository {
  abstract findAll(): Promise<AttendanceHourDto[]>;
  abstract findById(id: number): Promise<AttendanceHourDto | null>;
  abstract create(input: AttendanceHourRepositoryCreateInput): Promise<AttendanceHourDto>;
  abstract update(input: AttendanceHourRepositoryUpdateInput): Promise<AttendanceHourDto>;
  abstract delete(id: number): Promise<void>;
}
/* c8 ignore stop */
