import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityUpdateUseCase, CityMysqlRepository, ICityRepository } from '../../../../../../src';
import { cleanCityDB, createCity } from '../../../../../helpers';

describe('CityUpdateUseCase Integration Tests', () => {
  let repository: ICityRepository;
  let updateUseCase: CityUpdateUseCase;

  beforeAll(async () => {
    repository = new CityMysqlRepository();
    updateUseCase = new CityUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a city', async () => {
    const city = await createCity(repository);

    const city_updated = await updateUseCase.execute({
      id: city.city_id,
      name: 'City Updated',
      latitude: 762,
      longitude: 21
    });

    expect(city_updated).toEqual({
      city_id: city.city_id,
      city_name: 'City Updated',
      city_latitude: 762,
      city_longitude: 21,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if city is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'City Updated',
        latitude: 762,
        longitude: 21
      })
    ).rejects.toThrowError(`Cidade não encontrada pelo(a) id: ${id_error}`);
  });
});
