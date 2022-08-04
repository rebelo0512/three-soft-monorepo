import { Knex } from 'knex';
import {
  connectionMysqlFactory,
  connectionSqliteFactory,
  MysqlBaseRepository,
  MysqlBaseRepositoryFilter
} from '../../../../../../src';
import { createTableTestAndRecords } from '../../../../../helpers/utils/createTableTestAndRecords';

class StubMysqlRepository extends MysqlBaseRepository {
  testSetFilters(filters: MysqlBaseRepositoryFilter<never>[]): Knex.Sql {
    const query = this.connection('test').select();

    this.setFilters(query, filters);

    return query.toSQL();
  }

  testSetSortAndSortDirection(sort: string, sortDirection: 'asc' | 'desc'): string {
    const query = this.connection('test').select();

    this.setSortAndSortDirection(query, ['id'], sort, sortDirection);

    return query.toSQL().sql;
  }

  testConsumeSearchQuery(offset: number, limit: number) {
    const query = this.connection('test').select();

    return this.consumeSearchQuery(query, offset, limit, '*');
  }

  validateEntity(entity: unknown) {
    return this.validateEntityExist(entity);
  }
}

describe('MysqlBaseRepository Integration Tests', () => {
  const mysqlConnection = connectionMysqlFactory({
    host: 'host',
    port: 3306,
    database: 'database',
    username: 'username',
    password: 'password'
  });

  const sqliteConnection = connectionSqliteFactory({ filename: ':memory:' });

  afterAll(async () => {
    mysqlConnection.destroy();
    sqliteConnection.destroy();
  });

  it('must create a new instance', () => {
    const mysqlRepository = new MysqlBaseRepository(mysqlConnection);

    expect(mysqlRepository).toBeInstanceOf(MysqlBaseRepository);
  });

  describe('validateEntityExist', () => {
    it('must return the entity', () => {
      const stubMysqlRepository = new StubMysqlRepository(mysqlConnection);

      const response = stubMysqlRepository.validateEntity({ name: 1 });

      expect(response).toEqual({ name: 1 });
    });

    it('must return null if the entity not exist', () => {
      const stubMysqlRepository = new StubMysqlRepository(mysqlConnection);

      const response = stubMysqlRepository.validateEntity(null);

      expect(response).toBeNull();
    });
  });

  describe('setFilters', () => {
    it('must set one filter in query', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const query = stubMysqlRepository.testSetFilters([{ field: 'name', operator: '=', value: 'Name Test' }]);

      expect(query.sql).toBe('select * from `test` where name = ? ');
      expect(query.bindings).toEqual(['Name Test']);
    });

    it('must set filters and operators in the middle of each one in query', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const query = stubMysqlRepository.testSetFilters([
        {
          field: 'id',
          operator: '=',
          value: 1,
          next_query: 'AND'
        },
        {
          field: 'name',
          operator: 'LIKE',
          value: 'Name Test',
          next_query: 'OR'
        },
        {
          field: 'description',
          operator: '=',
          value: 'Desc Test'
        }
      ]);

      expect(query.sql).toBe('select * from `test` where id = ? AND name LIKE ? OR description = ? ');
      expect(query.bindings).toEqual([1, '%Name Test%', 'Desc Test']);
    });

    it('must not set filter in query if is invalid or empty', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const query = stubMysqlRepository.testSetFilters(null as never);

      expect(query.sql).toBe('select * from `test`');
      expect(query.bindings).toEqual([]);

      const queryTwo = stubMysqlRepository.testSetFilters([]);

      expect(queryTwo.sql).toBe('select * from `test`');
      expect(queryTwo.bindings).toEqual([]);
    });

    it('must set filter string empty in query if value is invalid', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const valuesInvalids = [null, undefined];

      valuesInvalids.forEach((valueInvalid) => {
        const query = stubMysqlRepository.testSetFilters([{ field: 'name', operator: '=', value: valueInvalid }]);

        expect(query.sql).toBe('select * from `test` where name = ? ');
        expect(query.bindings).toEqual(['']);
      });
    });
  });

  describe('setSortAndSortDirection', () => {
    it('must set sort and sort direction in query, ', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const sql = stubMysqlRepository.testSetSortAndSortDirection('id', 'asc');

      expect(sql).toBe('select * from `test` order by `id` asc');
    });

    it('must not set sort in query if field is not in sortableFields prop', () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const sql = stubMysqlRepository.testSetSortAndSortDirection('not in prop', 'asc');

      expect(sql).toBe('select * from `test` order by `created_at` asc');
    });
  });

  describe('consumeSearchQuery', () => {
    beforeAll(async () => {
      await createTableTestAndRecords(sqliteConnection, 5);
    });

    afterAll(async () => {
      await sqliteConnection.schema.dropTable('test');
    });

    it('must consume a search query returning total and items', async () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const searchResponse = await stubMysqlRepository.testConsumeSearchQuery(0, 5);

      expect(searchResponse).toEqual({
        count: 5,
        items: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
      });
    });

    it('must limit items returned by offset and limit and count remains the total', async () => {
      const stubMysqlRepository = new StubMysqlRepository(sqliteConnection);

      const searchResponse = await stubMysqlRepository.testConsumeSearchQuery(3, 2);

      expect(searchResponse).toEqual({
        count: 5,
        items: [{ id: 4 }, { id: 5 }]
      });
    });
  });
});
