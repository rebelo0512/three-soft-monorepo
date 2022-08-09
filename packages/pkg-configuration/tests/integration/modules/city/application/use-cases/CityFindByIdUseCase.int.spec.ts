import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityFindByIdUseCase, CityMysqlRepository, ICityRepository } from '../../../../../../src';
import { cleanCityDB, createCity } from '../../../../../helpers';

describe('CityFindByIdUseCase Integration Tests', () => {
  let repository: ICityRepository;
  let findByIdUseCase: CityFindByIdUseCase;

  beforeAll(async () => {
    repository = new CityMysqlRepository();
    findByIdUseCase = new CityFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return city by id', async () => {
    const city = await createCity(repository);

    const city_created = await findByIdUseCase.execute({ id: city.city_id });

    expect(city_created).toEqual(city);
  });

  it('should throw error if city is not found', async () => {
    await expect(() => findByIdUseCase.execute({ id: 0 })).rejects.toThrowError('Cidade não encontrada pelo(a) id: 0');
  });
});
