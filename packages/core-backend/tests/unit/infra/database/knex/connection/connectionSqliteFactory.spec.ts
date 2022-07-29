import { connectionSqliteFactory } from '../../../../../../src';

describe('connectionSqliteFactory Unit Tests', () => {
  it('must return a knex connection with mysql db', () => {
    const connection = connectionSqliteFactory({
      filename: 'test.db'
    });

    expect(connection.client.config.connection.filename).toBe('test.db');
  });
});
