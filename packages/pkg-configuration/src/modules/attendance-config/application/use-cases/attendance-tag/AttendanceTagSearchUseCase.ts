import { BaseUseCase } from '@three-soft/core-backend';
import { AttendanceTagDto, IAttendanceTagRepository, AttendanceTagSearchInputDto } from '../../../domain';

export class AttendanceTagSearchUseCase extends BaseUseCase<AttendanceTagSearchInputDto, AttendanceTagDto[]> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(input: AttendanceTagSearchInputDto): Promise<AttendanceTagDto[]> {
    return this.repository.search(input.name);
  }
}
