import { connectionMysqlFactory } from '../../../../../../src';

describe('connectionMysqlFactory Unit Tests', () => {
  it('must return a knex connection with mysql db', () => {
    const connection = connectionMysqlFactory({
      host: 'host',
      port: 3306,
      database: 'database',
      username: 'username',
      password: 'password'
    });

    expect(connection.client.config.connection.host).toBe('host');
    expect(connection.client.config.connection.port).toBe(3306);
    expect(connection.client.config.connection.database).toBe('database');
    expect(connection.client.config.connection.user).toBe('username');
    expect(connection.client.config.connection.password).toBe('password');
  });
});
