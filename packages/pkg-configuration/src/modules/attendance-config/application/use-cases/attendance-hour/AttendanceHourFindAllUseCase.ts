import { BaseUseCase } from '@three-soft/core-backend';
import { AttendanceHourDto, IAttendanceHourRepository } from '../../../domain';

export class AttendanceHourFindAllUseCase extends BaseUseCase<void, AttendanceHourDto[]> {
  constructor(private repository: IAttendanceHourRepository) {
    super();
  }

  async execute(): Promise<AttendanceHourDto[]> {
    return this.repository.findAll();
  }
}
