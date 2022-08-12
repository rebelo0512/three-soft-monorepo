import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { IAttendanceQueueRepository, AttendanceQueueDto, AttendanceQueueDeleteInputDto } from '../../../domain';

export class AttendanceQueueDeleteUseCase extends BaseUseCase<AttendanceQueueDeleteInputDto, AttendanceQueueDto> {
  constructor(private repository: IAttendanceQueueRepository) {
    super();
  }

  async execute(input: AttendanceQueueDeleteInputDto): Promise<AttendanceQueueDto> {
    const queue = await this.repository.findById(input.id);

    if (!queue) throw new EntityNotFoundError('Fila', input.id, 'id');

    await this.repository.delete(queue);

    return queue;
  }
}
