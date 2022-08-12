import {
  DatabaseMysqlConnection,
  EntityCreateError,
  EntityNotFoundError,
  MysqlBaseRepository
} from '@three-soft/core-backend';
import { Knex } from 'knex';
import { PermissionDomainDto } from '../../../../../../access-control/domain';
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
    const transaction = await this.connection.transaction();

    try {
      const [createdId] = await this.connection(this.table_name).transacting(transaction).insert({
        queue_name: input.name,
        queue_tag: input.tag,
        queue_color: input.color
      });

      await this.createTagToQueue(input, transaction);
      await this.createPermissionToQueue(input, transaction);

      await transaction.commit();

      const queue = await this.findById(createdId);

      /* c8 ignore next */
      if (!queue) throw new EntityCreateError('Fila');

      return queue;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async update(input: AttendanceQueueRepositoryUpdateInput): Promise<AttendanceQueueDto> {
    await this.connection(this.table_name)
      .update({
        queue_name: input.name,
        queue_color: input.color,
        updated_at: new Date()
      })
      .where('queue_id', input.id);

    const queue = await this.findById(input.id);

    /* c8 ignore next */
    if (!queue) throw new EntityCreateError('Fila');

    return queue;
  }

  async delete(queue: AttendanceQueueDto): Promise<void> {
    const transaction = await this.connection.transaction();

    try {
      await this.connection(this.table_name).where('queue_id', queue.queue_id).delete();

      await this.deleteTagToQueue(queue, transaction);
      await this.deletePermissionToQueue(queue, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // #region Create Methods

  private async createTagToQueue(input: AttendanceQueueRepositoryCreateInput, transaction: Knex.Transaction) {
    await this.connection('tags').transacting(transaction).insert({
      tag_name: input.tag
    });
  }

  private async createPermissionToQueue(input: AttendanceQueueRepositoryCreateInput, transaction: Knex.Transaction) {
    const permission_domain = await this.findPermissionDomainToQueue();

    await this.connection('permissions').transacting(transaction).insert({
      perm_name: input.name,
      perm_sub_dom_name: 'FILAS',
      perm_dom_id: permission_domain.perm_dom_id
    });
  }

  // #endregion

  // #region Delete Methods

  private async deleteTagToQueue(queue: AttendanceQueueDto, transaction: Knex.Transaction) {
    await this.connection('tags').transacting(transaction).where('tag_name', queue.queue_tag).delete();
  }

  private async deletePermissionToQueue(queue: AttendanceQueueDto, transaction: Knex.Transaction) {
    const permission_domain = await this.findPermissionDomainToQueue();

    await this.connection('permissions')
      .transacting(transaction)
      .where('perm_dom_id', permission_domain.perm_dom_id)
      .andWhere('perm_sub_dom_name', 'FILAS')
      .andWhere('perm_name', queue.queue_name)
      .delete();
  }

  // #endregion

  // #region Private Methods

  private async findPermissionDomainToQueue() {
    const permission_domain = await this.connection('permissions_domains')
      .select<PermissionDomainDto>('*')
      .where('perm_dom_name', 'LIBERACAO')
      .andWhere('perm_system_name', 'FIBER_THREE')
      .first();

    if (!permission_domain) throw new EntityNotFoundError('Domínio de permissão', 'LIBERACAO', 'nome');

    return permission_domain;
  }

  // #endregion
}
