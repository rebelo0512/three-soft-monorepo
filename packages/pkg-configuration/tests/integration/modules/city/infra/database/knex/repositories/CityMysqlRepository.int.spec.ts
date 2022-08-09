import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { CityMysqlRepository, ICityRepository } from '../../../../../../../../src';
import { cleanCityDB, createCities, createCity } from '../../../../../../../helpers';

describe('CityMysqlRepository Integration Tests', () => {
  let repository: ICityRepository;

  beforeAll(async () => {
    repository = new CityMysqlRepository();
  });

  beforeEach(async () => {
    await cleanCityDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all cities', async () => {
      await createCities(repository, 3);

      const cities = await repository.findAll();

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

  describe('findById', () => {
    it('should return city by id', async () => {
      const city = await createCity(repository);

      const city_created = await repository.findById(city.city_id);

      expect(city_created).toEqual(city);
    });

    it('should return null if id city not exist', async () => {
      const city = await repository.findById(0);

      expect(city).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return city by name', async () => {
      const city = await createCity(repository);

      const city_created = await repository.findByName(city.city_name);

      expect(city_created).toEqual(city);
    });

    it('should return null if name city not exist', async () => {
      const city = await repository.findByName('');

      expect(city).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const city_created = await repository.create({
        name: 'Name 01',
        latitude: 12,
        longitude: 121
      });

      expect(city_created).toEqual({
        city_id: expect.any(Number),
        city_name: 'Name 01',
        city_latitude: 12,
        city_longitude: 121,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a city', async () => {
      const city = await createCity(repository);

      const city_updated = await repository.update({
        id: city.city_id,
        name: 'Name 01',
        latitude: 12,
        longitude: 121
      });

      expect(city_updated).toEqual({
        city_id: expect.any(Number),
        city_name: 'Name 01',
        city_latitude: 12,
        city_longitude: 121,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });
});
