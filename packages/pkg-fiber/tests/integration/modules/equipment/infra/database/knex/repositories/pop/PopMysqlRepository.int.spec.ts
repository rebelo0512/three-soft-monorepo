import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { PopMysqlRepository, IPopRepository } from '../../../../../../../../../src';
import { cleanPopDB, createPop, createPops } from '../../../../../../../../helpers';

describe('PopMysqlRepository Integration Tests', () => {
  let cityRepository: ICityRepository;
  let repository: IPopRepository;

  beforeAll(async () => {
    cityRepository = new CityMysqlRepository();
    repository = new PopMysqlRepository();
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all pops', async () => {
      const city = await createCity(cityRepository);

      await createPops(repository, 3, city.city_name);

      const pops = await repository.findAll();

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

  describe('search', () => {
    it('should return all pops if no filter is provided', async () => {
      const city = await createCity(cityRepository);

      await createPops(repository, 3, city.city_name);

      const pops = await repository.search({ city: null, name: null });

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

      const pops = await repository.search({ name: 'Name 11', city: null });

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

      const pops = await repository.search({ city: city.city_name, name: null });

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

      const pops = await repository.search({ name: 'Name 11', city: city.city_name });

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

  describe('findById', () => {
    it('should return pop by id', async () => {
      const city = await createCity(cityRepository);

      const pop = await createPop(repository, city.city_name);

      const pop_created = await repository.findById(pop.pop_id);

      expect(pop_created).toEqual(pop);
    });

    it('should return null if id pop not exist', async () => {
      const pop = await repository.findById(0);

      expect(pop).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return pop by name', async () => {
      const city = await createCity(cityRepository);

      const pop = await createPop(repository, city.city_name);

      const pop_created = await repository.findByName(pop.pop_name);

      expect(pop_created).toEqual(pop);
    });

    it('should return null if name pop not exist', async () => {
      const pop = await repository.findByName('to be null');

      expect(pop).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a pop', async () => {
      const city = await createCity(cityRepository);

      const pop_created = await repository.create({
        name: 'Name Created',
        city: city.city_name,
        latitude: null,
        longitude: null
      });

      expect(pop_created).toEqual({
        pop_id: expect.any(Number),
        pop_name: 'Name Created',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: null,
        pop_longitude: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a pop', async () => {
      const city = await createCity(cityRepository);

      const pop = await createPop(repository, city.city_name);

      const pop_updated = await repository.update({
        id: pop.pop_id,
        name: 'Name Updated',
        latitude: 321,
        longitude: 123
      });

      expect(pop_updated).toEqual({
        pop_id: expect.any(Number),
        pop_name: 'Name Updated',
        pop_obs: null,
        pop_city_name: city.city_name,
        pop_latitude: 321,
        pop_longitude: 123,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });
});
