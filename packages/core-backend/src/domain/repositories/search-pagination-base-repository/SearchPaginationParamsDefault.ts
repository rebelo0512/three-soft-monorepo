export type SortDirection = 'asc' | 'desc';

export type SearchPaginationParamsProps<Filter> = {
  page?: number;
  limit?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchPaginationParamsDefault<Filter = string> {
  readonly page: number;
  readonly limit: number;
  readonly sort: string | null;
  readonly sortDirection: SortDirection | null;
  readonly filter: Filter | null;
  readonly offset: number;

  constructor(props: SearchPaginationParamsProps<Filter> = {}) {
    this.page = this.setPage(props.page);
    this.limit = this.setLimit(props.limit);
    this.sort = this.setSort(props.sort);
    this.sortDirection = this.setSortDirection(props.sortDirection);
    this.filter = this.setFilter(props.filter);
    this.offset = this.setOffset();
  }

  private setPage(pageValue: number | undefined) {
    let page = Number(pageValue);

    if (Number.isNaN(page) || page <= 0) page = 1;

    return parseInt(String(page));
  }

  private setLimit(limitValue: number | undefined) {
    let limit = Number(limitValue);

    if (Number.isNaN(limit) || limit <= 0) limit = 10;

    return parseInt(String(limit));
  }

  private setSort(sortValue: string | null | undefined) {
    return sortValue === null || sortValue === undefined || sortValue === '' ? null : `${sortValue}`;
  }

  private setSortDirection(sortDirectionValue: SortDirection | null | undefined) {
    if (!this.sort) {
      return null;
    }

    const direction = `${sortDirectionValue}`.toLowerCase();

    return direction !== 'asc' && direction !== 'desc' ? 'asc' : direction;
  }

  private setFilter(filterValue: Filter | null | undefined) {
    return filterValue === null || filterValue === undefined || (typeof filterValue === 'string' && filterValue === '')
      ? null
      : filterValue;
  }

  private setOffset() {
    return (this.page - 1) * this.limit;
  }
}
