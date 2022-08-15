import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import {
  PopDto,
  PopRepositoryCreateInput,
  PopRepositoryUpdateInput,
  IPopRepository,
  PopRepositorySearchInput
} from '../../../../../domain';

export class PopMysqlRepository extends MysqlBaseRepository implements IPopRepository {
  table_name = 'pops';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<PopDto[]> {
    return this.connection(this.table_name)
      .select<PopDto[]>()
      .orderBy('pop_city_name', 'asc')
      .orderBy('pop_name', 'asc');
  }

  async search(input: PopRepositorySearchInput): Promise<PopDto[]> {
    const query = this.connection(this.table_name).select<PopDto[]>();

    this.setFilters(query, [
      { field: 'pop_city_name', operator: 'LIKE', value: input.city, next_query: 'AND' },
      { field: 'pop_name', operator: 'LIKE', value: input.name }
    ]);

    query.orderBy('pop_name');

    return query;
  }

  async findById(id: number): Promise<PopDto | null> {
    const query = this.connection(this.table_name).select<PopDto>().where('pop_id', id).first();

    return this.validateEntityExist(await query);
  }

  async findByName(name: string): Promise<PopDto | null> {
    const query = this.connection(this.table_name).select<PopDto>().where('pop_name', name).first();

    return this.validateEntityExist(await query);
  }

  async create(input: PopRepositoryCreateInput): Promise<PopDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      pop_name: input.name,
      pop_city_name: input.city,
      pop_latitude: input.latitude,
      pop_longitude: input.longitude
    });

    const pop = await this.findById(createdId);

    /* c8 ignore next */
    if (!pop) throw new EntityCreateError('Pop');

    return pop;
  }

  async update(input: PopRepositoryUpdateInput): Promise<PopDto> {
    await this.connection(this.table_name)
      .update({
        pop_name: input.name,
        pop_latitude: input.latitude,
        pop_longitude: input.longitude
      })
      .where('pop_id', input.id);

    const pop = await this.findById(input.id);

    /* c8 ignore next */
    if (!pop) throw new EntityCreateError('Pop');

    return pop;
  }
}
