import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityCreateUseCase, CityMysqlRepository, ICityRepository } from '../../../../../../src';
import { cleanCityDB } from '../../../../../helpers';

describe('CityCreateUseCase Integration Tests', () => {
  let repository: ICityRepository;
  let createUseCase: CityCreateUseCase;

  beforeAll(async () => {
    repository = new CityMysqlRepository();
    createUseCase = new CityCreateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should create a city', async () => {
    const city = await createUseCase.execute({ name: 'City 01', latitude: 821, longitude: 762 });

    expect(city).toEqual({
      city_id: expect.any(Number),
      city_name: 'City 01',
      city_latitude: 821,
      city_longitude: 762,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });
});
