import { BaseUseCase } from '@three-soft/core-backend';
import { AttendanceTagDto, IAttendanceTagRepository } from '../../../domain';

export class AttendanceTagFindAllUseCase extends BaseUseCase<void, AttendanceTagDto[]> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(): Promise<AttendanceTagDto[]> {
    return this.repository.findAll();
  }
}
