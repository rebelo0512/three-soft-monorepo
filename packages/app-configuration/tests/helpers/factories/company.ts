import { generateString } from '@three-soft/core-backend';
import { Knex } from 'knex';
import { CompanyDto, CompanyRepositoryCreateInput, ICompanyRepository } from '../../../src';

export async function createCompany(repository: ICompanyRepository, props?: CompanyRepositoryCreateInput) {
  const permission = props || {
    cnpj: generateString(10),
    name: generateString(10),
    vlan: Math.floor(Math.random() * 1000)
  };

  return repository.create(permission);
}

export async function createCompanies(repository: ICompanyRepository, total: number) {
  const promises: Array<Promise<CompanyDto>> = [];
  for (let index = 0; index < total; index += 1) {
    promises.push(
      repository.create({
        cnpj: `CNPJ ${String(index + 1).padStart(2, '0')}`,
        name: `Name ${String(index + 1).padStart(2, '0')}`,
        vlan: index + 1
      })
    );
  }
  await Promise.all(promises);
}

export async function cleanCompanyDB(connection: Knex) {
  await connection('companies').delete();
}
