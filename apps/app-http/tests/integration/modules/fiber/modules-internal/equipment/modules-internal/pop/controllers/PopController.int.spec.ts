import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { cleanPopDB, createPops, createPop, IPopRepository } from '@three-soft/pkg-fiber';
import { PopController } from '../../../../../../../../../src/modules';
import { createPopModule } from '../../../../../../../../helpers';

describe('PopController Integration Tests', () => {
  let controller: PopController;
  let cityRepository: ICityRepository;
  let repository: IPopRepository;

  beforeAll(async () => {
    const moduleRef = await createPopModule();

    cityRepository = moduleRef.get<ICityRepository>(ICityRepository.name);
    repository = moduleRef.get<IPopRepository>(IPopRepository.name);
    controller = moduleRef.get<PopController>(PopController);
  });

  beforeEach(async () => {
    await cleanPopDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('must return a array of pop', async () => {
      const city = await createCity(cityRepository);

      await createPops(repository, 3, city.city_name);

      const pops = await controller.findAll();

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

      const pops = await controller.search({ city: null, name: null });

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

      const pops = await controller.search({ name: 'Name 11', city: null });

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

      const pops = await controller.search({ city: city.city_name, name: null });

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

      const pops = await controller.search({ name: 'Name 11', city: city.city_name });

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

      const pop_created = await controller.findById(pop.pop_id);

      expect(pop_created).toEqual(pop);
    });

    it('should throw an error if pop not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Pop não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('should return pop by id', async () => {
      const city = await createCity(cityRepository);

      const pop = await controller.create({
        name: 'Created',
        latitude: null,
        longitude: null,
        city: city.city_name
      });

      expect(pop.pop).toEqual({
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

    it('should throw error if city is not found', async () => {
      await expect(() =>
        controller.create({
          name: 'Created',
          latitude: null,
          longitude: null,
          city: 'to throw error'
        })
      ).rejects.toThrowError('Cidade não encontrada pelo(a) nome: to throw error');
    });
  });

  describe('update', () => {
    it('should update a pop', async () => {
      const city = await createCity(cityRepository);

      const pop = await createPop(repository, city.city_name);

      const pop_updated = await controller.update(pop.pop_id, {
        id: pop.pop_id,
        name: 'Name Updated',
        latitude: 321,
        longitude: 123
      });

      expect(pop_updated.pop).toEqual({
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

    it('should throw error if pop is not found', async () => {
      await expect(() =>
        controller.update(0, {
          name: 'Created',
          latitude: null,
          longitude: null,
          id: 0
        })
      ).rejects.toThrowError('Pop não encontrada pelo(a) id: 0');
    });
  });
});
