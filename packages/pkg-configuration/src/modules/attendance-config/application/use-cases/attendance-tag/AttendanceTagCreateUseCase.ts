import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { AttendanceTagCreateValidationSchema } from '../../validators';
import { AttendanceTagDto, AttendanceTagCreateInputDto, IAttendanceTagRepository } from '../../../domain';

export class AttendanceTagCreateUseCase extends BaseUseCase<AttendanceTagCreateInputDto, AttendanceTagDto> {
  constructor(private repository: IAttendanceTagRepository) {
    super();
  }

  async execute(input: AttendanceTagCreateInputDto): Promise<AttendanceTagDto> {
    const dto = await validateSchema<AttendanceTagCreateInputDto>(AttendanceTagCreateValidationSchema, input);

    return this.repository.create(dto.name);
  }
}
