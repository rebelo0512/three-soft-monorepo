import { Knex } from 'knex';
import { MysqlBaseRepositoryFilter } from '.';

export class MysqlBaseRepository {
  protected table_name = 'test';

  constructor(protected readonly connection: Knex) {}

  protected setFilters<T>(query_builder: Knex.QueryBuilder, filters: MysqlBaseRepositoryFilter<T>[]) {
    const is_valid = this.validateFilter(filters);

    if (!is_valid) return;

    const query_raw: string[] = [];
    const bindings: string[] = [];

    filters.forEach((filter) => this.setFilter(query_raw, bindings, filter));

    query_builder.whereRaw(query_raw.join(' '), bindings);
  }

  protected setSortAndSortDirection<T>(
    query_builder: Knex.QueryBuilder,
    sortable_fields: (keyof T)[],
    sort: string,
    sort_direction: 'asc' | 'desc'
  ) {
    const is_sortable = this.validateFieldIsSortable<T>(sortable_fields, sort);

    let sort_field = sort;
    if (!is_sortable) {
      sort_field = 'created_at';
    }

    query_builder.orderBy(sort_field, sort_direction);
  }

  protected async consumeSearchQuery<QueryResponse>(
    query: Knex.QueryBuilder,
    offset: number,
    limit: number,
    count_field: 'string' | '*',
    ...select_fields: string[]
  ): Promise<{
    count: number;
    items: Awaited<Knex.QueryBuilder<never, QueryResponse>>;
  }> {
    const [{ count }] = await query.clone().count({ count: count_field });

    const items = await query
      .clone()
      .offset(offset)
      .limit(limit)
      .select<QueryResponse>(...select_fields);

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
    query_raw: string[],
    bindings: unknown[],
    { field, value, operator, next_query }: MysqlBaseRepositoryFilter<T>
  ) {
    const value_is_valid = value ?? '';
    const value_formatted = operator === 'LIKE' ? `%${value_is_valid}%` : value_is_valid;
    query_raw.push(`${String(field)} ${operator} ? ${next_query || ''}`);
    bindings.push(value_formatted);
  }

  private validateFieldIsSortable<T>(sortable_fields: (keyof T)[], sort: string) {
    return sortable_fields.some((field) => field === sort);
  }

  /* #endregion */
}
