import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { CityDto, CityRepositoryCreateInput, ICityRepository } from '../../../src';

export async function createCity(repository: ICityRepository, props?: CityRepositoryCreateInput) {
  const city = props || {
    name: generateString(10),
    latitude: Math.floor(Math.random() * 1000),
    longitude: Math.floor(Math.random() * 1000)
  };

  return repository.create(city);
}

export async function createCities(repository: ICityRepository, total: number) {
  const promises: Array<Promise<CityDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        latitude: index + 1,
        longitude: index + 1
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanCityDB(connection: Knex) {
  await connection('cities').delete();
}
