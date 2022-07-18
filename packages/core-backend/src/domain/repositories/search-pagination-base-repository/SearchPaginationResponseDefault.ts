export type SearchPaginationResponseProps<EntityDto> = {
  items: EntityDto[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  sort?: string | null;
  sortDirection?: 'asc' | 'desc' | null;
  filter?: string | null;
};

export class SearchPaginationResponseDefault<EntityDto> {
  readonly items: EntityDto[];
  readonly totalItems: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly itemsPerPage: number;
  readonly sort: string | null;
  readonly sortDirection: 'asc' | 'desc' | null;
  readonly filter: string | null;

  constructor(props: SearchPaginationResponseProps<EntityDto>) {
    this.items = props.items;
    this.totalItems = props.totalItems;
    this.currentPage = props.currentPage;
    this.itemsPerPage = props.itemsPerPage;
    this.sort = props.sort ?? null;
    this.sortDirection = props.sortDirection ?? null;
    this.filter = props.filter ?? null;
    this.totalPages = this.calcTotalPage();
  }

  private calcTotalPage() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  getDto() {
    return {
      items: this.items,
      totalItems: this.totalItems,
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      itemsPerPage: this.itemsPerPage,
      sort: this.sort,
      sortDirection: this.sortDirection,
      filter: this.filter
    };
  }
}
