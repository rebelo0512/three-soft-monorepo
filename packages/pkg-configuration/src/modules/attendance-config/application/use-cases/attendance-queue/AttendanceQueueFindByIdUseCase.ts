import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceQueueRepository, AttendanceQueueDto, AttendanceQueueFindByIdInputDto } from '../../../domain';

export class AttendanceQueueFindByIdUseCase extends BaseUseCase<AttendanceQueueFindByIdInputDto, AttendanceQueueDto> {
  constructor(private repository: IAttendanceQueueRepository) {
    super();
  }

  async execute(input: AttendanceQueueFindByIdInputDto): Promise<AttendanceQueueDto> {
    const queue = await this.repository.findById(input.id);

    if (!queue) throw new EntityNotFoundError('Fila', input.id, 'id');

    return queue;
  }
}
