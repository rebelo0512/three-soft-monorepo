import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { cleanCityDB, createCities, createCity, ICityRepository } from '@three-soft/pkg-configuration';
import { CityController } from '../../../../../../../src/modules';
import { createCityModule } from '../../../../../../helpers';

describe('CityController Integration Tests', () => {
  let controller: CityController;
  let repository: ICityRepository;

  beforeAll(async () => {
    const moduleRef = await createCityModule();

    repository = moduleRef.get<ICityRepository>(ICityRepository.name);
    controller = moduleRef.get<CityController>(CityController);
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('must return a array of city', async () => {
      await createCities(repository, 3);

      const companies = await controller.findAll();

      expect(companies.length).toBe(3);
      expect(companies).toEqual([
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

  describe('findById', () => {
    it('must return a city by id', async () => {
      const city_created = await createCity(repository);

      const city = await controller.findById(city_created.city_id);

      expect(city).toEqual(city_created);
    });

    it('should throw an error if city not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Cidade não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('must create a city', async () => {
      const city = await controller.create({ name: 'Name Created', latitude: 12, longitude: 121 });

      expect(city.city).toEqual({
        city_id: expect.any(Number),
        city_name: 'Name Created',
        city_latitude: 12,
        city_longitude: 121,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('must update required props of a category', async () => {
      const city = await createCity(repository);

      const city_updated = await controller.update(city.city_id, {
        id: city.city_id,
        name: 'Name Updated',
        latitude: 12,
        longitude: 121
      });

      expect(city_updated.city).toEqual({
        ...city,
        city_name: 'Name Updated',
        city_latitude: 12,
        city_longitude: 121,
        updated_at: expect.any(Date)
      });
    });

    it('should throw an error if city not found', async () => {
      const id_wrong = Math.floor(Math.random() * 1000);

      await expect(() =>
        controller.update(id_wrong, {
          id: id_wrong,
          name: 'Name Updated',
          latitude: 12,
          longitude: 121
        })
      ).rejects.toThrowError(`Cidade não encontrada pelo(a) id: ${id_wrong}`);
    });
  });
});
