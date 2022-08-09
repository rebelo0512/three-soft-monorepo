import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityFindAllUseCase, CityMysqlRepository, ICityRepository } from '../../../../../../src';
import { cleanCityDB, createCities } from '../../../../../helpers';

describe('CityFindAllUseCase Integration Tests', () => {
  let repository: ICityRepository;
  let findAllUseCase: CityFindAllUseCase;

  beforeAll(async () => {
    repository = new CityMysqlRepository();
    findAllUseCase = new CityFindAllUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return all cities', async () => {
    await createCities(repository, 3);

    const cities = await findAllUseCase.execute();

    expect(cities.length).toBe(3);
    expect(cities).toEqual([
      {
        city_id: expect.any(Number),
        city_name: 'Name 01',
        city_latitude: 1,
        city_longitude: 1,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        city_id: expect.any(Number),
        city_name: 'Name 02',
        city_latitude: 2,
        city_longitude: 2,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      {
        city_id: expect.any(Number),
        city_name: 'Name 03',
        city_latitude: 3,
        city_longitude: 3,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      }
    ]);
  });
});
