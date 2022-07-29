export type MysqlBaseRepositoryFilter<T> = {
  field: keyof T;
  operator: '=' | 'LIKE';
  value: unknown;
  nextQuery?: 'AND' | 'OR';
};
