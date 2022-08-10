import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { AttendanceQueueUpdateValidationSchema } from '../../validators';
import { AttendanceQueueDto, AttendanceQueueUpdateInputDto, IAttendanceQueueRepository } from '../../../domain';

export class AttendanceQueueUpdateUseCase extends BaseUseCase<AttendanceQueueUpdateInputDto, AttendanceQueueDto> {
  constructor(private repository: IAttendanceQueueRepository) {
    super();
  }

  async execute(input: AttendanceQueueUpdateInputDto): Promise<AttendanceQueueDto> {
    const dto = await validateSchema<AttendanceQueueUpdateInputDto>(AttendanceQueueUpdateValidationSchema, input);

    const queue = await this.getAttendanceQueue(dto);

    return this.repository.update({
      ...dto,
      id: queue.queue_id
    });
  }

  private async getAttendanceQueue(dto: AttendanceQueueUpdateInputDto) {
    const queue = await this.repository.findById(dto.id);

    if (!queue) throw new EntityNotFoundError('Fila', dto.id, 'id');

    return queue;
  }
}
