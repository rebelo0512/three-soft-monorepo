import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { ICityRepository, CityMysqlRepository, createCity } from '@three-soft/pkg-configuration';
import { IPopRepository, PopMysqlRepository, PopSearchUseCase } from '../../../../../../../src';
import { cleanPopDB, createPops } from '../../../../../../helpers';

describe('PopSearchUseCase Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;
  let searchUseCase: PopSearchUseCase;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
    searchUseCase = new PopSearchUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all pops if no filter is provided', async () => {
    const city = await createCity(cityRepository);

    await createPops(repository, 3, city.city_name);

    const pops = await searchUseCase.execute({ city: null, name: null });

    expect(pops.length).toBe(3);
    expect(pops).toEqual([
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 01',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 1,
        pop_longitude: 1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 02',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 2,
        pop_longitude: 2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 03',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 3,
        pop_longitude: 3,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should filter pops by name', async () => {
    const city = await createCity(cityRepository);

    await createPops(repository, 11, city.city_name);

    const pops = await searchUseCase.execute({ name: 'Name 11', city: null });

    expect(pops.length).toBe(1);
    expect(pops).toEqual([
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 11',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 11,
        pop_longitude: 11,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should filter pops by city', async () => {
    const city = await createCity(cityRepository);

    await createPops(repository, 3, city.city_name);

    const pops = await searchUseCase.execute({ city: city.city_name, name: null });

    expect(pops.length).toBe(3);
    expect(pops).toEqual([
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 01',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 1,
        pop_longitude: 1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 02',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 2,
        pop_longitude: 2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 03',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 3,
        pop_longitude: 3,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });

  it('should filter pops by city and name', async () => {
    const city = await createCity(cityRepository);

    await createPops(repository, 11, city.city_name);

    const pops = await searchUseCase.execute({ name: 'Name 11', city: city.city_name });

    expect(pops.length).toBe(1);
    expect(pops).toEqual([
      {
        pop_id: expect.any(Number),
        pop_name: 'Name 11',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 11,
        pop_longitude: 11,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
