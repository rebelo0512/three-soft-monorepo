import knex from 'knex';

type IConnectionMysqlFactory = {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export function connectionMysqlFactory({ host, port, database, username, password }: IConnectionMysqlFactory) {
  return knex({
    client: 'mysql2',
    connection: {
      user: username,
      password,
      host,
      port,
      database,
      decimalNumbers: true
    }
  });
}
