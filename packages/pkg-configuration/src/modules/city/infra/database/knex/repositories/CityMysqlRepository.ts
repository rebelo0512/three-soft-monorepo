import { DatabaseMysqlConnection, EntityCreateError, MysqlBaseRepository } from '@three-soft/core-backend';
import { CityDto, CityRepositoryCreateInput, CityRepositoryUpdateInput, ICityRepository } from '../../../../domain';

export class CityMysqlRepository extends MysqlBaseRepository implements ICityRepository {
  table_name = 'cities';

  constructor() {
    super(DatabaseMysqlConnection);
  }

  async findAll(): Promise<CityDto[]> {
    return this.connection(this.table_name).select<CityDto[]>().orderBy('city_name', 'asc');
  }

  async findById(id: number): Promise<CityDto | null> {
    const query = await this.connection(this.table_name).select<CityDto>().where('city_id', id).first();

    return this.validateEntityExist(query);
  }

  async findByName(name: string): Promise<CityDto | null> {
    const query = await this.connection(this.table_name).select<CityDto>().where('city_name', name).first();

    return this.validateEntityExist(query);
  }

  async create(input: CityRepositoryCreateInput): Promise<CityDto> {
    const [createdId] = await this.connection(this.table_name).insert({
      city_name: input.name,
      city_latitude: input.latitude,
      city_longitude: input.longitude
    });

    const city = await this.findById(createdId);

    /* c8 ignore next */
    if (!city) throw new EntityCreateError('Cidade');

    return city;
  }

  async update(input: CityRepositoryUpdateInput): Promise<CityDto> {
    await this.connection(this.table_name)
      .update({
        city_name: input.name,
        city_latitude: input.latitude,
        city_longitude: input.longitude,
        updated_at: new Date()
      })
      .where('city_id', input.id);

    const company = await this.findById(input.id);

    /* c8 ignore next */
    if (!company) throw new EntityCreateError('Cidade');

    return company;
  }
}
