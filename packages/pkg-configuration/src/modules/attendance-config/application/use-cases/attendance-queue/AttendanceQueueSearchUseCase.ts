import { BaseUseCase } from '@three-soft/core-backend';
import { AttendanceQueueDto, IAttendanceQueueRepository, AttendanceQueueSearchInputDto } from '../../../domain';

export class AttendanceQueueSearchUseCase extends BaseUseCase<AttendanceQueueSearchInputDto, AttendanceQueueDto[]> {
  constructor(private repository: IAttendanceQueueRepository) {
    super();
  }

  async execute(input: AttendanceQueueSearchInputDto): Promise<AttendanceQueueDto[]> {
    return this.repository.search(input.name);
  }
}
