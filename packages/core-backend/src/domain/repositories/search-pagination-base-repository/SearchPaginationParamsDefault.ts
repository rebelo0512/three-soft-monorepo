export type SortDirection = 'asc' | 'desc';

export type SearchPaginationParamsProps<Filter> = {
  page?: number;
  limit?: number;
  sort?: string | null;
  sortDirection?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchPaginationParamsDefault<Filter = string> {
  protected _page: number;
  protected _limit: number;
  protected _sort: string | null;
  protected _sortDirection: SortDirection | null;
  protected _filter: Filter | null;
  protected _offset: number;

  constructor(props: SearchPaginationParamsProps<Filter> = {}) {
    this.page = props.page;
    this.limit = props.limit;
    this.sort = props.sort;
    this.sortDirection = props.sortDirection;
    this.filter = props.filter;
    this.setOffset();
  }

  public get page() {
    return this._page;
  }

  private set page(pageValue: number | undefined) {
    let page = Number(pageValue);

    if (Number.isNaN(page) || page <= 0) page = 1;

    this._page = parseInt(String(page));
  }

  public get limit() {
    return this._limit;
  }

  private set limit(limitValue: number | undefined) {
    let limit = Number(limitValue);

    if (Number.isNaN(limit) || limit <= 0) limit = 10;

    this._limit = parseInt(String(limit));
  }

  public get sort() {
    return this._sort;
  }

  private set sort(sortValue: string | null | undefined) {
    this._sort = sortValue === null || sortValue === undefined || sortValue === '' ? null : `${sortValue}`;
  }

  public get sortDirection() {
    return this._sortDirection;
  }

  private set sortDirection(sortDirectionValue: SortDirection | null | undefined) {
    if (!this.sort) {
      this._sortDirection = null;
      return;
    }

    const direction = `${sortDirectionValue}`.toLowerCase();

    this._sortDirection = direction !== 'asc' && direction !== 'desc' ? 'asc' : direction;
  }

  public get filter() {
    return this._filter;
  }

  private set filter(filterValue: Filter | null | undefined) {
    this._filter =
      filterValue === null || filterValue === undefined || (typeof filterValue === 'string' && filterValue === '')
        ? null
        : filterValue;
  }

  public get offset() {
    return this._offset;
  }

  private setOffset() {
    this._offset = (this._page - 1) * this._limit;
  }
}
