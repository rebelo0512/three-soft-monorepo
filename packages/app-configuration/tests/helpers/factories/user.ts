import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { UserDto, UserRepositoryCreateInput, IUserRepository } from '../../../src';
import { cleanCompanyDB, cleanGroupDB } from '.';

type UserProps = {
  company_id: number;
  group_id: number;
};

export async function createUser(
  repository: IUserRepository,
  { company_id, group_id }: UserProps,
  props?: UserRepositoryCreateInput
) {
  const user = props || {
    name: generateString(10),
    email: generateString(10),
    password: generateString(10),
    company_id,
    group_id
  };

  return repository.create(user);
}

export async function createUsers(repository: IUserRepository, total: number, { company_id, group_id }: UserProps) {
  const promises: Array<Promise<UserDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        email: `CNPJ ${String(index + 1).padStart(2, '0')}`,
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        password: `Password ${String(index + 1).padStart(2, '0')}`,
        company_id,
        group_id
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanUserDB(connection: Knex) {
  await cleanCompanyDB(connection);
  await cleanGroupDB(connection);
  await connection('users').delete();
}
