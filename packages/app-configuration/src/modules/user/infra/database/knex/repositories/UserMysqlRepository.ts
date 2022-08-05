import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { Knex } from 'knex';
import {
  IUserRepository,
  UserDto,
  UserRepositoryCreateInput,
  UserRepositoryFindByEmailOrNameInput,
  UserRepositorySearchInput,
  UserRepositoryUpdateInput,
  UserRepositoryUpdateLastTokenInput,
  UserRepositoryUpdatePasswordInput
} from '../../../../domain';

export class UserMysqlRepository extends MysqlBaseRepository implements IUserRepository {
  table_name = 'users';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<UserDto[]> {
    const query = this.connection(this.table_name).select<UserDto[]>();

    this.setGroupJoin(query);
    this.setCompanyJoin(query);

    query.orderBy(`${this.table_name}.user_name`, 'asc');

    return query;
  }

  async search(input: UserRepositorySearchInput): Promise<UserDto[]> {
    const query = this.connection(this.table_name).select<UserDto[]>();

    this.setGroupJoin(query);
    this.setCompanyJoin(query);

    this.setFilters(query, [
      { field: 'user_email', operator: 'LIKE', value: input.email, next_query: 'AND' },
      { field: 'user_name', operator: 'LIKE', value: input.name }
    ]);

    query.orderBy('user_name');

    return query;
  }

  async findById(id: number): Promise<UserDto | null> {
    const query = this.connection(this.table_name).select<UserDto>();

    this.setGroupJoin(query);
    this.setCompanyJoin(query);

    query.where(`${this.table_name}.user_id`, id).first();

    return this.validateEntityExist(await query);
  }

  async findByEmailOrName(input: UserRepositoryFindByEmailOrNameInput): Promise<UserDto | null> {
    const query = this.connection(this.table_name).select<UserDto>();

    this.setGroupJoin(query);
    this.setCompanyJoin(query);

    query
      .where(`${this.table_name}.user_email`, input.email)
      .orWhere(`${this.table_name}.user_name`, input.name)
      .first();

    return this.validateEntityExist(await query);
  }

  async findByGroupId(group_id: number): Promise<UserDto | null> {
    const query = this.connection(this.table_name).select<UserDto>();

    this.setGroupJoin(query);
    this.setCompanyJoin(query);

    query.where(`${this.table_name}.user_group_id`, group_id).first();

    return this.validateEntityExist(await query);
  }

  async create(input: UserRepositoryCreateInput): Promise<UserDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      user_name: input.name,
      user_email: input.email,
      user_password: input.password,
      user_group_id: input.group_id,
      user_comp_id: input.company_id
    });

    return this.getUserWithValidation(createdId);
  }

  async update(input: UserRepositoryUpdateInput): Promise<UserDto> {
    const data_to_update = {
      user_name: input.name,
      user_email: input.email,
      user_status: input.status,
      user_group_id: input.group_id,
      ...(input.password && { user_password: input.password })
    };

    await this.connection(this.table_name).update(data_to_update).where(`${this.table_name}.user_id`, input.id);

    return this.getUserWithValidation(input.id);
  }

  async updatePassword(input: UserRepositoryUpdatePasswordInput): Promise<UserDto> {
    await this.connection(this.table_name)
      .update({
        user_password: input.password
      })
      .where(`${this.table_name}.user_id`, input.id);

    return this.getUserWithValidation(input.id);
  }

  async updateLastToken(input: UserRepositoryUpdateLastTokenInput): Promise<UserDto> {
    await this.connection(this.table_name)
      .update({
        user_last_token: input.token
      })
      .where(`${this.table_name}.user_id`, input.id);

    return this.getUserWithValidation(input.id);
  }

  // #region Private Methods

  private async getUserWithValidation(id: number) {
    const user = await this.findById(id);

    /* c8 ignore next */
    if (!user) throw new EntityCreateError('Usuário');

    return user;
  }

  private setGroupJoin(builder: Knex.QueryBuilder) {
    builder.join('´groups´', '´groups´.group_id', `${this.table_name}.user_group_id`);
  }

  private setCompanyJoin(builder: Knex.QueryBuilder) {
    builder.join('companies', 'companies.comp_id', `${this.table_name}.user_comp_id`);
  }

  // #endregion
}
