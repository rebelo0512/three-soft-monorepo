import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import {
  AttendanceHourDto,
  AttendanceHourRepositoryCreateInput,
  AttendanceHourRepositoryUpdateInput,
  IAttendanceHourRepository
} from '../../../../../domain';

export class AttendanceHourMysqlRepository extends MysqlBaseRepository implements IAttendanceHourRepository {
  table_name = 'attendance_hours';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<AttendanceHourDto[]> {
    return this.connection(this.table_name).select<AttendanceHourDto[]>().orderBy('att_hour_name', 'asc');
  }

  async findById(id: number): Promise<AttendanceHourDto | null> {
    const query = this.connection(this.table_name).select<AttendanceHourDto>().where('att_hour_id', id).first();

    return this.validateEntityExist(await query);
  }

  async create(input: AttendanceHourRepositoryCreateInput): Promise<AttendanceHourDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      att_hour_end: input.end,
      att_hour_friday: input.friday,
      att_hour_message: input.message,
      att_hour_monday: input.monday,
      att_hour_name: input.name,
      att_hour_saturday: input.saturday,
      att_hour_start: input.start,
      att_hour_sunday: input.sunday,
      att_hour_thursday: input.thursday,
      att_hour_tuesday: input.tuesday,
      att_hour_wednesday: input.wednesday,
      att_hour_status: input.status
    });

    const hour = await this.findById(createdId);

    /* c8 ignore next */
    if (!hour) throw new EntityCreateError('Horário de Atendimento');

    return hour;
  }

  async update(input: AttendanceHourRepositoryUpdateInput): Promise<AttendanceHourDto> {
    await this.connection(this.table_name)
      .update({
        att_hour_end: input.end,
        att_hour_friday: input.friday,
        att_hour_message: input.message,
        att_hour_monday: input.monday,
        att_hour_name: input.name,
        att_hour_saturday: input.saturday,
        att_hour_start: input.start,
        att_hour_sunday: input.sunday,
        att_hour_thursday: input.thursday,
        att_hour_tuesday: input.tuesday,
        att_hour_wednesday: input.wednesday,
        att_hour_status: input.status
      })
      .where('att_hour_id', input.id);

    const hour = await this.findById(input.id);

    /* c8 ignore next */
    if (!hour) throw new EntityCreateError('Horário de Atendimento');

    return hour;
  }

  async delete(id: number): Promise<void> {
    await this.connection(this.table_name).where('att_hour_id', id).delete();
  }
}
