import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import {
  AttendanceQueueDto,
  AttendanceQueueRepositoryCreateInput,
  AttendanceQueueRepositoryUpdateInput,
  IAttendanceQueueRepository
} from '../../../../../domain';

export class AttendanceQueueMysqlRepository extends MysqlBaseRepository implements IAttendanceQueueRepository {
  table_name = 'attendance_queue';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async search(name: string | null): Promise<AttendanceQueueDto[]> {
    const query = this.connection(this.table_name).select<AttendanceQueueDto[]>();

    this.setFilters(query, [{ field: 'queue_name', operator: 'LIKE', value: name }]);

    query.orderBy('queue_name', 'asc');

    return query;
  }

  async findById(id: number): Promise<AttendanceQueueDto | null> {
    const query = this.connection(this.table_name).select<AttendanceQueueDto>().where('queue_id', id).first();

    return this.validateEntityExist(await query);
  }

  async findByTag(tag: string): Promise<AttendanceQueueDto | null> {
    const query = this.connection(this.table_name).select<AttendanceQueueDto>().where('queue_tag', tag).first();

    return this.validateEntityExist(await query);
  }

  async findByName(name: string): Promise<AttendanceQueueDto | null> {
    const query = this.connection(this.table_name).select<AttendanceQueueDto>().where('queue_name', name).first();

    return this.validateEntityExist(await query);
  }

  async create(input: AttendanceQueueRepositoryCreateInput): Promise<AttendanceQueueDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      queue_name: input.name,
      queue_tag: input.tag,
      queue_color: input.color
    });

    const queue = await this.findById(createdId);

    /* c8 ignore next */
    if (!queue) throw new EntityCreateError('Fila');

    return queue;
  }

  async update(input: AttendanceQueueRepositoryUpdateInput): Promise<AttendanceQueueDto> {
    await this.connection(this.table_name)
      .update({
        queue_name: input.name,
        queue_tag: input.tag,
        queue_color: input.color,
        updated_at: new Date()
      })
      .where('queue_id', input.id);

    const queue = await this.findById(input.id);

    /* c8 ignore next */
    if (!queue) throw new EntityCreateError('Fila');

    return queue;
  }

  async delete(id: number): Promise<void> {
    await this.connection(this.table_name).where('queue_id', id).delete();
  }
}
