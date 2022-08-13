import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { AttendanceHourUpdateValidationSchema } from '../../validators';
import { AttendanceHourDto, AttendanceHourUpdateInputDto, IAttendanceHourRepository } from '../../../domain';

export class AttendanceHourUpdateUseCase extends BaseUseCase<AttendanceHourUpdateInputDto, AttendanceHourDto> {
  constructor(private repository: IAttendanceHourRepository) {
    super();
  }

  async execute(input: AttendanceHourUpdateInputDto): Promise<AttendanceHourDto> {
    const dto = await validateSchema<AttendanceHourUpdateInputDto>(AttendanceHourUpdateValidationSchema, input);

    const hour = await this.getAttendanceHour(dto);

    return this.repository.update({
      ...dto,
      id: hour.att_hour_id
    });
  }

  private async getAttendanceHour(dto: AttendanceHourUpdateInputDto) {
    const hour = await this.repository.findById(dto.id);

    if (!hour) throw new EntityNotFoundError('Horário de Atendimento', dto.id, 'id');

    return hour;
  }
}
