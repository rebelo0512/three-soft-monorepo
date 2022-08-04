import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { GroupDto, GroupRepositoryUpdatePermissionsInput, IGroupRepository, PermissionDto } from '../../../../domain';

export class GroupMysqlRepository extends MysqlBaseRepository implements IGroupRepository {
  table_name = '´groups´';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<GroupDto[]> {
    return this.connection(this.table_name).select<GroupDto[]>().orderBy('group_name', 'asc');
  }

  async search(name: string | null | undefined): Promise<GroupDto[]> {
    return this.connection(this.table_name)
      .select<GroupDto[]>()
      .where('group_name', 'LIKE', `%${name || ''}%`)
      .orderBy('group_name', 'asc');
  }

  async findById(id: number): Promise<GroupDto | null> {
    const query = await this.connection(this.table_name)
      .select<GroupDto[]>()
      .where('group_id', id)
      .orderBy('group_name', 'asc')
      .first();

    return this.validateEntityExist(query);
  }

  async findByName(name: string): Promise<GroupDto | null> {
    const query = await this.connection(this.table_name)
      .select<GroupDto[]>()
      .where('group_name', name)
      .orderBy('group_name', 'asc')
      .first();

    return this.validateEntityExist(query);
  }

  async create(name: string): Promise<GroupDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      group_name: name
    });

    const group = await this.findById(createdId);

    /* c8 ignore next */
    if (!group) throw new EntityCreateError('Grupo');

    return group;
  }

  async updatePermissions({
    group_id,
    permissions_to_add,
    permissions_to_delete
  }: GroupRepositoryUpdatePermissionsInput): Promise<void> {
    const transaction = await this.connection.transaction();

    try {
      await this.createGroupPermissions(group_id, permissions_to_add, transaction);
      await this.deleteGroupPermissions(group_id, permissions_to_delete, transaction);

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  async delete(id: number): Promise<void> {
    const transaction = await this.connection.transaction();

    try {
      await this.connection('groups_permissions').transacting(transaction).where('group_perm_group_id', id).delete();

      await this.connection(this.table_name).transacting(transaction).where('group_id', id).delete();

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  // #region Update Permission

  private async createGroupPermissions(
    group_id: number,
    permissions_to_add: PermissionDto[],
    transaction: Knex.Transaction
  ) {
    if (!permissions_to_add.length) return;

    const rows_to_insert = permissions_to_add.map((permission) => ({
      group_perm_perm_id: permission.perm_id,
      group_perm_group_id: group_id
    }));

    await this.connection('groups_permissions').transacting(transaction).insert(rows_to_insert);
  }

  private async deleteGroupPermissions(
    group_id: number,
    permissions_to_delete: PermissionDto[],
    transaction: Knex.Transaction
  ) {
    if (!permissions_to_delete.length) return;

    const ids_to_delete = permissions_to_delete.map((permission) => permission.perm_id);

    await this.connection('groups_permissions')
      .transacting(transaction)
      .delete()
      .whereIn('group_perm_perm_id', ids_to_delete)
      .andWhere('group_perm_group_id', group_id);
  }

  // #endregion
}
