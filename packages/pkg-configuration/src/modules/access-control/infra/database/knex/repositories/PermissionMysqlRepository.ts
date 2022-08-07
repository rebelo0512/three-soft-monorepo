import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { Knex } from 'knex';
import {
  IPermissionRepository,
  PermissionDto,
  PermissionRepositoryCreateInput,
  PermissionRepositoryFindAllBySystemNameAndDomainNameInput,
  PermissionRepositoryFindAllSubDomainsByDomainIdOutput,
  PermissionRepositoryFindAllBySystemNameAndDomainNameAndSubDomainInput
} from '../../../../domain';

export class PermissionMysqlRepository extends MysqlBaseRepository implements IPermissionRepository {
  table_name = 'permissions';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>();

    this.setPermissionDomainJoin(query);

    query.orderBy('perm_name', 'asc');

    return query;
  }

  async findAllByDomainName(domain_name: string): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>();

    this.setPermissionDomainJoin(query);

    query
      .where('permissions_domains.perm_dom_name', domain_name)
      .andWhereRaw(`${this.table_name}.perm_sub_dom_name IS NULL`)
      .orderBy(`${this.table_name}.perm_name`, 'asc');

    return query;
  }

  async findAllBySubDomainName(sub_domain: string): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>();

    this.setPermissionDomainJoin(query);

    query.where(`${this.table_name}.perm_sub_dom_name`, sub_domain).orderBy(`${this.table_name}.perm_name`, 'asc');

    return query;
  }

  async findAllSubDomainsByDomainId(
    domain_id: number
  ): Promise<PermissionRepositoryFindAllSubDomainsByDomainIdOutput[]> {
    const query = this.connection(this.table_name).select<PermissionRepositoryFindAllSubDomainsByDomainIdOutput[]>(
      `${this.table_name}.perm_sub_dom_name`
    );

    this.setPermissionDomainJoin(query);

    query
      .where('permissions_domains.perm_dom_id', domain_id)
      .andWhereRaw(`${this.table_name}.perm_sub_dom_name IS NOT NULL`)
      .groupBy(`${this.table_name}.perm_sub_dom_name`)
      .orderBy(`${this.table_name}.perm_sub_dom_name`, 'asc');

    return query;
  }

  async findAllBySystemNameAndDomainName(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameInput
  ): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>();

    this.setPermissionDomainJoin(query);

    query
      .where('permissions_domains.perm_dom_name', input.domain_name)
      .andWhere('permissions_domains.perm_system_name', input.system_name)
      .andWhereRaw(`${this.table_name}.perm_sub_dom_name IS NULL`);

    return query;
  }

  async findAllBySystemNameAndDomainNameAndSubDomain(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameAndSubDomainInput
  ): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>();

    this.setPermissionDomainJoin(query);

    query
      .where('permissions_domains.perm_dom_name', input.domain_name)
      .andWhere('permissions_domains.perm_system_name', input.system_name)
      .andWhere(`${this.table_name}.perm_sub_dom_name`, input.sub_domain);

    return query;
  }

  async findAllByGroupId(group_id: number): Promise<PermissionDto[]> {
    const query = this.connection(this.table_name).select<PermissionDto[]>(
      `${this.table_name}.perm_id`,
      `${this.table_name}.perm_name`,
      `${this.table_name}.perm_sub_dom_name`,
      `${this.table_name}.created_at`,
      `${this.table_name}.updated_at`,
      'permissions_domains.perm_dom_id',
      'permissions_domains.perm_system_name',
      'permissions_domains.perm_dom_name'
    );

    this.setPermissionDomainJoin(query);
    this.setGroupJoin(query);

    query.where('´groups´.group_id', group_id).orderBy(`${this.table_name}.perm_name`, 'asc');

    return query;
  }

  async findById(id: number): Promise<PermissionDto | null> {
    const query = this.connection(this.table_name).select<PermissionDto>();

    this.setPermissionDomainJoin(query);

    query.where(`${this.table_name}.perm_id`, id).first();

    return this.validateEntityExist(await query);
  }

  async findByName(name: string): Promise<PermissionDto | null> {
    const query = this.connection(this.table_name).select<PermissionDto>();

    this.setPermissionDomainJoin(query);

    query.where(`${this.table_name}.perm_name`, name).first();

    return this.validateEntityExist(await query);
  }

  async create(input: PermissionRepositoryCreateInput): Promise<PermissionDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      perm_name: input.name,
      perm_sub_dom_name: input.sub_domain,
      perm_dom_id: input.domain_id
    });

    const permission = await this.findById(createdId);

    /* c8 ignore next */
    if (!permission) throw new EntityCreateError('Permissão');

    return permission;
  }

  // #region Private Methods

  private setGroupJoin(builder: Knex.QueryBuilder) {
    builder
      .join('groups_permissions', 'groups_permissions.group_perm_perm_id', `${this.table_name}.perm_id`)
      .join('´groups´', '´groups´.group_id', 'groups_permissions.group_perm_group_id');
  }

  private setPermissionDomainJoin(builder: Knex.QueryBuilder) {
    builder.join('permissions_domains', 'permissions_domains.perm_dom_id', `${this.table_name}.perm_dom_id`);
  }

  // #endregion
}
