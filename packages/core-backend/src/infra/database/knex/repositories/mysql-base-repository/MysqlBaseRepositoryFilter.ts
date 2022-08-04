export type MysqlBaseRepositoryFilter<T> = {
  field: keyof T;
  operator: '=' | 'LIKE';
  value: unknown;
  next_query?: 'AND' | 'OR';
};
