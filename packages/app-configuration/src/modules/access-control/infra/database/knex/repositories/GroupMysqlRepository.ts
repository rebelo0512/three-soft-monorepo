import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { GroupDto, IGroupRepository } from '../../../../domain';

export class GroupMysqlRepository extends MysqlBaseRepository implements IGroupRepository {
  tableName = '´groups´';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<GroupDto[]> {
    return this.connection(this.tableName).select<GroupDto[]>().orderBy('group_name', 'asc');
  }

  async search(name: string | null | undefined): Promise<GroupDto[]> {
    return this.connection(this.tableName)
      .select<GroupDto[]>()
      .where('group_name', 'LIKE', `%${name || ''}%`)
      .orderBy('group_name', 'asc');
  }

  async findById(id: number): Promise<GroupDto | null> {
    const query = await this.connection(this.tableName)
      .select<GroupDto[]>()
      .where('group_id', id)
      .orderBy('group_name', 'asc')
      .first();

    return this.validateEntityExist(query);
  }

  async findByName(name: string): Promise<GroupDto | null> {
    const query = await this.connection(this.tableName)
      .select<GroupDto[]>()
      .where('group_name', name)
      .orderBy('group_name', 'asc')
      .first();

    return this.validateEntityExist(query);
  }

  async create(name: string): Promise<GroupDto> {
    const [createdId] = await this.connection(this.tableName).insert({
      group_name: name
    });

    const group = await this.findById(createdId);

    if (!group) throw new EntityCreateError('Grupo');

    return group;
  }

  async delete(id: number): Promise<void> {
    const transaction = await this.connection.transaction();

    try {
      await this.connection('groups_permissions').transacting(transaction).where('group_perm_group_id', id).delete();

      await this.connection(this.tableName).transacting(transaction).where('group_id', id).delete();

      await transaction.commit();
    } catch {
      await transaction.rollback();
    }
  }
}
