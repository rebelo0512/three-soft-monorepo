import {
  BaseDto,
  ISearchBaseRepository,
  SearchPaginationParamsDefault,
  SearchPaginationResponseDefault
} from '../../../../domain';
import { InMemoryRepository } from './InMemoryRepository';

export abstract class SearchPaginationInMemoryRepository<EntityDto extends BaseDto>
  extends InMemoryRepository<EntityDto>
  implements ISearchBaseRepository<EntityDto>
{
  sortableFields: Array<keyof EntityDto> = ['created_at'];

  async searchPagination(props: SearchPaginationParamsDefault): Promise<SearchPaginationResponseDefault<EntityDto>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);

    const itemsSorted = await this.applySort(itemsFiltered, props.sort as keyof EntityDto, props.sortDirection);

    const itemsPaginated = await this.applyPagination(itemsSorted, props.page, props.itemsPerPage);

    return new SearchPaginationResponseDefault({
      items: itemsPaginated,
      totalItems: itemsFiltered.length,
      currentPage: props.page,
      itemsPerPage: props.itemsPerPage,
      filter: props.filter,
      sort: props.sort,
      sortDirection: props.sortDirection
    });
  }

  /* #region Abstract Methods */

  protected abstract applyFilter(items: EntityDto[], filter: string | null): Promise<EntityDto[]>;

  /* #endregion */

  /* #region Protected Methods */

  protected async applySort(
    items: EntityDto[],
    sort: keyof EntityDto | null,
    sortDirection: SearchPaginationParamsDefault['sortDirection']
  ): Promise<EntityDto[]> {
    if (!this.validateFieldCouldSortable(sort) || !sort) {
      return items;
    }

    return items.sort((a, b) => this.sortItems(sort, sortDirection, a, b));
  }

  protected async applyPagination(
    items: EntityDto[],
    page: SearchPaginationParamsDefault['page'],
    itemsPerPage: SearchPaginationParamsDefault['itemsPerPage']
  ): Promise<EntityDto[]> {
    const start = (page - 1) * itemsPerPage;

    const itemsPerPageCalculated = start + itemsPerPage;

    return items.slice(start, itemsPerPageCalculated);
  }

  /* #endregion */

  /* #region Private Methods */

  private validateFieldCouldSortable(sort: keyof EntityDto | null) {
    return sort && this.getSortableField(sort);
  }

  private getSortableField(sort: keyof EntityDto | null) {
    return this.sortableFields.find((s) => s === sort);
  }

  private sortItems(
    sort: keyof EntityDto,
    sortDirection: SearchPaginationParamsDefault['sortDirection'],
    a: EntityDto,
    b: EntityDto
  ) {
    if (sortDirection === 'desc') {
      return this.descSort(sort, a, b);
    }

    return this.ascSort(sort, a, b);
  }

  /* c8 ignore start */
  private ascSort(sort: keyof EntityDto, a: EntityDto, b: EntityDto) {
    if (a[sort] < b[sort]) {
      return -1;
    }

    if (a[sort] > b[sort]) {
      return 1;
    }

    return 0;
  }

  private descSort(sort: keyof EntityDto, a: EntityDto, b: EntityDto) {
    if (a[sort] > b[sort]) {
      return -1;
    }

    if (a[sort] < b[sort]) {
      return 1;
    }

    return 0;
  }
  /* c8 ignore stop */

  /* #endregion */
}
