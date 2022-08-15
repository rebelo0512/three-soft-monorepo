import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { IPopRepository, PopCreateUseCase, PopMysqlRepository } from '../../../../../../../src';
import { cleanPopDB } from '../../../../../../helpers';

describe('PopCreateUseCase Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;
  let createUseCase: PopCreateUseCase;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
    createUseCase = new PopCreateUseCase(repository, cityRepository);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return pop by id', async () => {
    const city = await createCity(cityRepository);

    const pop = await createUseCase.execute({ name: 'Created', latitude: null, longitude: null, city: city.city_name });

    expect(pop).toEqual({
      pop_id: expect.any(Number),
      pop_name: 'Created',
      pop_obs: null,
      pop_city_name: city.city_name,
      pop_latitude: null,
      pop_longitude: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if pop is not found', async () => {
    await expect(() =>
      createUseCase.execute({
        name: 'Created',
        latitude: null,
        longitude: null,
        city: 'to throw error'
      })
    ).rejects.toThrowError('Cidade não encontrada pelo(a) nome: to throw error');
  });
});
