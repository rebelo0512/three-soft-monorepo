import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceHourRepository, AttendanceHourDto, AttendanceHourFindByIdInputDto } from '../../../domain';

export class AttendanceHourFindByIdUseCase extends BaseUseCase<AttendanceHourFindByIdInputDto, AttendanceHourDto> {
  constructor(private repository: IAttendanceHourRepository) {
    super();
  }

  async execute(input: AttendanceHourFindByIdInputDto): Promise<AttendanceHourDto> {
    const hour = await this.repository.findById(input.id);

    if (!hour) throw new EntityNotFoundError('Horário de Atendimento', input.id, 'id');

    return hour;
  }
}
