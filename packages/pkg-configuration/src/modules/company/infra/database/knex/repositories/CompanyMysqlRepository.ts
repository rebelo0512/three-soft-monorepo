import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import {
  CompanyDto,
  CompanyRepositoryCreateInput,
  CompanyRepositoryUpdateInput,
  ICompanyRepository
} from '../../../../domain';

export class CompanyMysqlRepository extends MysqlBaseRepository implements ICompanyRepository {
  table_name = 'companies';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<CompanyDto[]> {
    return this.connection(this.table_name).select<CompanyDto[]>().orderBy('comp_name', 'asc');
  }

  async findById(id: number): Promise<CompanyDto | null> {
    const query = await this.connection(this.table_name).select<CompanyDto>().where('comp_id', id).first();

    return this.validateEntityExist(query);
  }

  async findByName(name: string): Promise<CompanyDto | null> {
    const query = await this.connection(this.table_name).select<CompanyDto>().where('comp_name', name).first();

    return this.validateEntityExist(query);
  }

  async create(input: CompanyRepositoryCreateInput): Promise<CompanyDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      comp_cnpj: input.cnpj,
      comp_name: input.name,
      comp_vlan: input.vlan
    });

    const company = await this.findById(createdId);

    /* c8 ignore next */
    if (!company) throw new EntityCreateError('Empresa');

    return company;
  }

  async update(input: CompanyRepositoryUpdateInput): Promise<CompanyDto> {
    await this.connection(this.table_name)
      .update({
        comp_cnpj: input.cnpj,
        comp_name: input.name,
        comp_vlan: input.vlan,
        updated_at: new Date()
      })
      .where('comp_id', input.id);

    const company = await this.findById(input.id);

    /* c8 ignore next */
    if (!company) throw new EntityCreateError('Empresa');

    return company;
  }
}
