import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { AttendanceHourCreateValidationSchema } from '../../validators';
import { AttendanceHourDto, AttendanceHourCreateInputDto, IAttendanceHourRepository } from '../../../domain';

export class AttendanceHourCreateUseCase extends BaseUseCase<AttendanceHourCreateInputDto, AttendanceHourDto> {
  constructor(private repository: IAttendanceHourRepository) {
    super();
  }

  async execute(input: AttendanceHourCreateInputDto): Promise<AttendanceHourDto> {
    const dto = await validateSchema<AttendanceHourCreateInputDto>(AttendanceHourCreateValidationSchema, input);

    return this.repository.create(dto);
  }
}
