import knex from 'knex';

type IConnectionSqliteFactory = {
  filename: string;
};

export function connectionSqliteFactory({ filename }: IConnectionSqliteFactory) {
  return knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename
    }
  });
}
