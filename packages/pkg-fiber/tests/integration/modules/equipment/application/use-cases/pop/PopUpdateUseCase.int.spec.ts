import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { PopUpdateUseCase, PopMysqlRepository, IPopRepository } from '../../../../../../../src';
import { cleanPopDB, createPop } from '../../../../../../helpers';

describe('PopUpdateUseCase Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;
  let updateUseCase: PopUpdateUseCase;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
    updateUseCase = new PopUpdateUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should update a pop', async () => {
    const city = await createCity(cityRepository);

    const pop = await createPop(repository, city.city_name);

    const pop_updated = await updateUseCase.execute({
      id: pop.pop_id,
      name: 'Pop Updated',
      latitude: null,
      longitude: null
    });

    expect(pop_updated).toEqual({
      pop_id: expect.any(Number),
      pop_name: 'Pop Updated',
      pop_obs: null,
      pop_city_name: city.city_name,
      pop_latitude: null,
      pop_longitude: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error if pop is not found', async () => {
    const id_error = Math.floor(Math.random() * 100000);

    await expect(() =>
      updateUseCase.execute({
        id: id_error,
        name: 'Pop Updated',
        latitude: null,
        longitude: null
      })
    ).rejects.toThrowError(`Pop não encontrada pelo(a) id: ${id_error}`);
  });
});
