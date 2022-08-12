import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { AttendanceTagDto, AttendanceTagRepositoryUpdateInput, IAttendanceTagRepository } from '../../../../../domain';

export class AttendanceTagMysqlRepository extends MysqlBaseRepository implements IAttendanceTagRepository {
  table_name = 'attendance_tags';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<AttendanceTagDto[]> {
    return this.connection(this.table_name).select<AttendanceTagDto[]>().orderBy('att_tag_name', 'asc');
  }

  async search(name: string | null): Promise<AttendanceTagDto[]> {
    const query = this.connection(this.table_name).select<AttendanceTagDto[]>();

    this.setFilters(query, [{ field: 'att_tag_name', operator: 'LIKE', value: name }]);

    query.orderBy('att_tag_name', 'asc');

    return query;
  }

  async findById(id: number): Promise<AttendanceTagDto | null> {
    const query = this.connection(this.table_name).select<AttendanceTagDto>().where('att_tag_id', id).first();

    return this.validateEntityExist(await query);
  }

  async create(name: string): Promise<AttendanceTagDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      att_tag_name: name
    });

    const tag = await this.findById(createdId);

    /* c8 ignore next */
    if (!tag) throw new EntityCreateError('Tag');

    return tag;
  }

  async update(input: AttendanceTagRepositoryUpdateInput): Promise<AttendanceTagDto> {
    await this.connection(this.table_name)
      .update({
        att_tag_name: input.name,
        updated_at: new Date()
      })
      .where('att_tag_id', input.id);

    const tag = await this.findById(input.id);

    /* c8 ignore next */
    if (!tag) throw new EntityCreateError('Tag');

    return tag;
  }

  async delete(id: number): Promise<void> {
    await this.connection(this.table_name).where('att_tag_id', id).delete();
  }
}
