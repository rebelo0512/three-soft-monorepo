import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { Knex } from 'knex';
import {
  IPermissionRepository,
  PermissionDto,
  PermissionRepositoryCreateInput,
  PermissionRepositoryFindAllBySystemNameAndDomainNameInput,
  PermissionRepositoryFindAllSubDomainsByDomainIdOutput
} from '../../../../domain';

export class PermissionMysqlRepository extends MysqlBaseRepository implements IPermissionRepository {
  tableName = 'permissions';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<PermissionDto[]> {
    const query = this.connection(this.tableName).select<PermissionDto[]>().orderBy('perm_name', 'asc');

    this.setPermissionDomainJoin(query);

    return query;
  }

  async findAllByDomainName(domain_name: string): Promise<PermissionDto[]> {
    const query = this.connection(this.tableName)
      .select<PermissionDto[]>()
      .where('permissions_domains.perm_dom_name', domain_name)
      .andWhereRaw(`${this.tableName}.perm_sub_dom_name IS NULL`)
      .orderBy(`${this.tableName}.perm_name`, 'asc');

    this.setPermissionDomainJoin(query);

    return query;
  }

  async findAllBySubDomainName(sub_domain: string): Promise<PermissionDto[]> {
    const query = this.connection(this.tableName)
      .select<PermissionDto[]>()
      .where(`${this.tableName}.perm_sub_dom_name`, sub_domain)
      .orderBy(`${this.tableName}.perm_name`, 'asc');

    this.setPermissionDomainJoin(query);

    return query;
  }

  async findAllSubDomainsByDomainId(
    domain_id: number
  ): Promise<PermissionRepositoryFindAllSubDomainsByDomainIdOutput[]> {
    const query = this.connection(this.tableName)
      .select<PermissionRepositoryFindAllSubDomainsByDomainIdOutput[]>(`${this.tableName}.perm_sub_dom_name`)
      .where('permissions_domains.perm_dom_id', domain_id)
      .andWhereRaw(`${this.tableName}.perm_sub_dom_name IS NOT NULL`)
      .groupBy(`${this.tableName}.perm_sub_dom_name`)
      .orderBy(`${this.tableName}.perm_sub_dom_name`, 'asc');

    this.setPermissionDomainJoin(query);

    return query;
  }

  async findAllBySystemNameAndDomainName(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameInput
  ): Promise<PermissionDto[]> {
    const query = this.connection(this.tableName)
      .select<PermissionDto[]>()
      .where('permissions_domains.perm_dom_name', input.domain_name)
      .andWhere('permissions_domains.perm_system_name', input.system_name);

    this.setPermissionDomainJoin(query);

    return query;
  }

  async findById(id: number): Promise<PermissionDto | null> {
    const query = this.connection(this.tableName)
      .select<PermissionDto>()
      .where(`${this.tableName}.perm_id`, id)
      .first();

    this.setPermissionDomainJoin(query);

    return this.validateEntityExist(await query);
  }

  async findByName(name: string): Promise<PermissionDto | null> {
    const query = this.connection(this.tableName)
      .select<PermissionDto>()
      .where(`${this.tableName}.perm_name`, name)
      .first();

    this.setPermissionDomainJoin(query);

    return this.validateEntityExist(await query);
  }

  async create(input: PermissionRepositoryCreateInput): Promise<PermissionDto> {
    const [createdId] = await this.connection(this.tableName).insert({
      perm_name: input.name,
      perm_sub_dom_name: input.sub_domain,
      perm_dom_id: input.domain_id
    });

    const permission = await this.findById(createdId);

    if (!permission) throw new EntityCreateError('Permissão');

    return permission;
  }

  // #region Private Methods

  private setPermissionDomainJoin(builder: Knex.QueryBuilder) {
    builder.join('permissions_domains', 'permissions_domains.perm_dom_id', `${this.tableName}.perm_dom_id`);
  }

  // #endregion
}
