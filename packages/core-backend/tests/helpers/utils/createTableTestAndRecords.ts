/* eslint-disable @typescript-eslint/no-explicit-any */
import { Knex } from 'knex';

export async function createTableTestAndRecords(connection: Knex, totalRecords: number) {
  await connection.schema.createTable('test', (table) => {
    table.increments();
  });

  const promises: Array<Knex.QueryBuilder<any, number[]>> = [];
  for (let index = 0; index < totalRecords; index += 1) {
    promises.push(
      connection('test').insert({
        id: index + 1
      })
    );
  }
  await Promise.all(promises);
}
