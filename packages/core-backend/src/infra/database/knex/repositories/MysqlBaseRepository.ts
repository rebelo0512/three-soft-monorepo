import { Knex } from 'knex';
import { MysqlBaseRepositoryFilter } from '.';

export class MysqlBaseRepository {
  protected tableName = 'test';

  constructor(protected readonly connection: Knex) {}

  protected setFilters<T>(queryBuilder: Knex.QueryBuilder, filters: MysqlBaseRepositoryFilter<T>[]) {
    const isValid = this.validateFilter(filters);

    if (!isValid) return;

    const queryRaw: string[] = [];
    const bindings: string[] = [];

    filters.forEach((filter) => this.setFilter(queryRaw, bindings, filter));

    queryBuilder.whereRaw(queryRaw.join(' '), bindings);
  }

  protected setSortAndSortDirection<T>(
    queryBuilder: Knex.QueryBuilder,
    sortableFields: (keyof T)[],
    sort: string,
    sortDirection: 'asc' | 'desc'
  ) {
    const isSortable = this.validateFieldIsSortable<T>(sortableFields, sort);

    let sortField = sort;
    if (!isSortable) {
      sortField = 'created_at';
    }

    queryBuilder.orderBy(sortField, sortDirection);
  }

  protected async consumeSearchQuery<QueryResponse>(
    query: Knex.QueryBuilder,
    offset: number,
    limit: number,
    countField: 'string' | '*',
    ...selectFields: string[]
  ): Promise<{
    count: number;
    items: Awaited<Knex.QueryBuilder<never, QueryResponse>>;
  }> {
    const [{ count }] = await query.clone().count({ count: countField });

    const items = await query
      .clone()
      .offset(offset)
      .limit(limit)
      .select<QueryResponse>(...selectFields);

    return { count: Number(count), items };
  }

  protected validateEntityExist<T>(entity: T | null | undefined): T | null {
    if (!entity) return null;

    return entity;
  }

  /* #region Private Methods */

  private validateFilter<T>(filters: MysqlBaseRepositoryFilter<T>[]) {
    if (!filters) return false;

    return !(Array.isArray(filters) && !filters.length);
  }

  setFilter<T>(
    queryRaw: string[],
    bindings: unknown[],
    { field, value, operator, nextQuery }: MysqlBaseRepositoryFilter<T>
  ) {
    const valueIsValid = value ?? '';
    const valueFormatted = operator === 'LIKE' ? `%${valueIsValid}%` : valueIsValid;
    queryRaw.push(`${String(field)} ${operator} ? ${nextQuery || ''}`);
    bindings.push(valueFormatted);
  }

  private validateFieldIsSortable<T>(sortableFields: (keyof T)[], sort: string) {
    return sortableFields.some((field) => field === sort);
  }

  /* #endregion */
}
