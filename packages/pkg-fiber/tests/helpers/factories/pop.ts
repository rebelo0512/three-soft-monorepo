import { generateString } from '@three-soft/core-backend';
import { cleanCityDB } from '@three-soft/pkg-configuration';
import { Knex } from 'knex';
import { PopDto, PopRepositoryCreateInput, IPopRepository } from '../../../src';

export async function createPop(repository: IPopRepository, city_name: string, props?: PopRepositoryCreateInput) {
  const pop = props || {
    name: generateString(10),
    latitude: Math.floor(Math.random() * 1000),
    longitude: Math.floor(Math.random() * 1000),
    city: city_name
  };

  return repository.create(pop);
}

export async function createPops(repository: IPopRepository, total: number, city_name: string) {
  const promises: Array<Promise<PopDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        latitude: index + 1,
        longitude: index + 1,
        city: city_name
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanPopDB(connection: Knex) {
  await connection('pops').delete();
  await cleanCityDB(connection);
}
