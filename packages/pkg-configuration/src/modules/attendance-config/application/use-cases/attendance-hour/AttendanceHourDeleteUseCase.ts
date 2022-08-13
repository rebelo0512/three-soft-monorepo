import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceHourRepository, AttendanceHourDto, AttendanceHourDeleteInputDto } from '../../../domain';

export class AttendanceHourDeleteUseCase extends BaseUseCase<AttendanceHourDeleteInputDto, AttendanceHourDto> {
  constructor(private repository: IAttendanceHourRepository) {
    super();
  }

  async execute(input: AttendanceHourDeleteInputDto): Promise<AttendanceHourDto> {
    const hour = await this.repository.findById(input.id);

    if (!hour) throw new EntityNotFoundError('Horário de Atendimento', input.id, 'id');

    await this.repository.delete(hour.att_hour_id);

    return hour;
  }
}
