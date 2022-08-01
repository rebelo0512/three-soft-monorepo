import { SearchPaginationParamsDefault, SearchPaginationResponseDefault } from './search-pagination-base-repository';
import { IBaseRepository } from './IBaseRepository';

export interface ISearchBaseRepository<
  EntityDto,
  Filter = string,
  SearchParams = SearchPaginationParamsDefault<Filter>,
  SearchResponse = SearchPaginationResponseDefault<EntityDto>
> extends IBaseRepository {
  sortableFields: Array<keyof EntityDto>;
  searchPagination(params: SearchParams): Promise<SearchResponse>;
  findAll(): Promise<EntityDto[]>;
  findById(id: number): Promise<EntityDto>;
  create(entity: EntityDto): Promise<EntityDto>;
  update(entity: EntityDto): Promise<void>;
  delete(id: number): Promise<void>;
}
