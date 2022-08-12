import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceTagRepository, AttendanceTagDto, AttendanceTagFindByIdInputDto } from '../../../domain';

export class AttendanceTagFindByIdUseCase extends BaseUseCase<AttendanceTagFindByIdInputDto, AttendanceTagDto> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(input: AttendanceTagFindByIdInputDto): Promise<AttendanceTagDto> {
    const queue = await this.repository.findById(input.id);

    if (!queue) throw new EntityNotFoundError('Tag', input.id, 'id');

    return queue;
  }
}
