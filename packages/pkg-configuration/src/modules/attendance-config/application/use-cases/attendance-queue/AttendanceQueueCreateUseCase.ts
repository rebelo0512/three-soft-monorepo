import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { AttendanceQueueCreateValidationSchema } from '../../validators';
import { AttendanceQueueDto, AttendanceQueueCreateInputDto, IAttendanceQueueRepository } from '../../../domain';

export class AttendanceQueueCreateUseCase extends BaseUseCase<AttendanceQueueCreateInputDto, AttendanceQueueDto> {
  constructor(private repository: IAttendanceQueueRepository) {
    super();
  }

  async execute(input: AttendanceQueueCreateInputDto): Promise<AttendanceQueueDto> {
    const dto = await validateSchema<AttendanceQueueCreateInputDto>(AttendanceQueueCreateValidationSchema, input);

    return this.repository.create(dto);
  }
}
