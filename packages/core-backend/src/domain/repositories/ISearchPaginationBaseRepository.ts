import { SearchPaginationParamsDefault, SearchPaginationResponseDefault } from './search-pagination-base-repository';
import { IBaseRepository } from './IBaseRepository';

export interface ISearchBaseRepository<
  EntityDto,
  Filter = string,
  SearchParams = SearchPaginationParamsDefault<Filter>,
  SearchResponse = SearchPaginationResponseDefault<EntityDto>
> extends IBaseRepository<EntityDto> {
  sortableFields: Array<keyof EntityDto>;
  searchPagination(params: SearchParams): Promise<SearchResponse>;
}
