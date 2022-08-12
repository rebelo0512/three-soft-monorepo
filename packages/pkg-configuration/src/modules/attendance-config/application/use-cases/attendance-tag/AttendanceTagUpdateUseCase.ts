import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { AttendanceTagUpdateValidationSchema } from '../../validators';
import { AttendanceTagDto, AttendanceTagUpdateInputDto, IAttendanceTagRepository } from '../../../domain';

export class AttendanceTagUpdateUseCase extends BaseUseCase<AttendanceTagUpdateInputDto, AttendanceTagDto> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(input: AttendanceTagUpdateInputDto): Promise<AttendanceTagDto> {
    const dto = await validateSchema<AttendanceTagUpdateInputDto>(AttendanceTagUpdateValidationSchema, input);

    const tag = await this.getAttendanceTag(dto);

    return this.repository.update({
      ...dto,
      id: tag.att_tag_id
    });
  }

  private async getAttendanceTag(dto: AttendanceTagUpdateInputDto) {
    const tag = await this.repository.findById(dto.id);

    if (!tag) throw new EntityNotFoundError('Tag', dto.id, 'id');

    return tag;
  }
}
