import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  PermissionDomainDto,
  PermissionDomainRepositoryCreateInput,
  PermissionDomainRepositoryFindAllSystemsOutput,
  PermissionDomainRepositoryFindBySystemNameAndNameInput
} from '../../../../domain';

export class PermissionDomainMysqlRepository extends MysqlBaseRepository implements IPermissionDomainRepository {
  table_name = 'permissions_domains';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAllSystems(): Promise<PermissionDomainRepositoryFindAllSystemsOutput[]> {
    return this.connection(this.table_name)
      .select<PermissionDomainRepositoryFindAllSystemsOutput[]>('perm_system_name')
      .groupBy('perm_system_name');
  }

  async findAllDomainBySystemName(system_name: string): Promise<PermissionDomainDto[]> {
    return this.connection(this.table_name).select<PermissionDomainDto[]>('*').where('perm_system_name', system_name);
  }

  async findById(id: number): Promise<PermissionDomainDto | null> {
    const permission_domain = await this.connection(this.table_name)
      .select<PermissionDomainDto>('*')
      .where('perm_dom_id', id)
      .first();

    return this.validateEntityExist(permission_domain);
  }

  async findByName(name: string): Promise<PermissionDomainDto | null> {
    const permission_domain = await this.connection(this.table_name)
      .select<PermissionDomainDto>('*')
      .where('perm_dom_name', name)
      .first();

    return this.validateEntityExist(permission_domain);
  }

  async findBySystemNameAndName(
    input: PermissionDomainRepositoryFindBySystemNameAndNameInput
  ): Promise<PermissionDomainDto | null> {
    const permission_domain = await this.connection(this.table_name)
      .select<PermissionDomainDto>('*')
      .where('perm_dom_name', input.name)
      .andWhere('perm_system_name', input.system_name)
      .first();

    return this.validateEntityExist(permission_domain);
  }

  async create(input: PermissionDomainRepositoryCreateInput): Promise<PermissionDomainDto> {
    const [id] = await this.connection(this.table_name).insert({
      perm_system_name: input.system_name,
      perm_dom_name: input.name
    });

    const domain = await this.findById(id);

    /* c8 ignore next */
    if (!domain) throw new EntityCreateError('Domínio de Permissão');

    return domain;
  }
}
