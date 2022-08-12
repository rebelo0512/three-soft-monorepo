import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceTagRepository, AttendanceTagDto, AttendanceTagDeleteInputDto } from '../../../domain';

export class AttendanceTagDeleteUseCase extends BaseUseCase<AttendanceTagDeleteInputDto, AttendanceTagDto> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(input: AttendanceTagDeleteInputDto): Promise<AttendanceTagDto> {
    const tag = await this.repository.findById(input.id);

    if (!tag) throw new EntityNotFoundError('Tag', input.id, 'id');

    await this.repository.delete(tag.att_tag_id);

    return tag;
  }
}
