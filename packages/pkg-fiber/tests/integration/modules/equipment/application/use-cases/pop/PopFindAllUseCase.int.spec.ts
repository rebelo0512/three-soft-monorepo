import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { PopFindAllUseCase, PopMysqlRepository, IPopRepository } from '../../../../../../../src';
import { cleanPopDB, createPops } from '../../../../../../helpers';

describe('PopFindAllUseCase Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;
  let findAllUseCase: PopFindAllUseCase;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
    findAllUseCase = new PopFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all pops', async () => {
    const city = await createCity(cityRepository);

    await createPops(repository, 3, city.city_name);

    const pops = await findAllUseCase.execute();

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
});
