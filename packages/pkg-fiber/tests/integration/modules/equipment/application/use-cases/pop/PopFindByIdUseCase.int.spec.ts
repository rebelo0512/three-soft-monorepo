import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { IPopRepository, PopFindByIdUseCase, PopMysqlRepository } from '../../../../../../../src';
import { cleanPopDB, createPop } from '../../../../../../helpers';

describe('PopFindByIdUseCase Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;
  let findByIdUseCase: PopFindByIdUseCase;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
    findByIdUseCase = new PopFindByIdUseCase(repository);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  it('should return pop by id', async () => {
    const city = await createCity(cityRepository);

    const pop_created = await createPop(repository, city.city_name);

    const pop = await findByIdUseCase.execute({ id: pop_created.pop_id });

    expect(pop).toEqual(pop_created);
  });

  it('should throw error if pop is not found', async () => {
    await expect(() =>
      findByIdUseCase.execute({
        id: 0
      })
    ).rejects.toThrowError('Pop não encontrada pelo(a) id: 0');
  });
});
