import { SearchPaginationParamsDefault, SearchPaginationParamsProps } from '@three-soft/core-backend';

export type IGroupRepositorySearchParamsProps<Filter> = SearchPaginationParamsProps<Filter>;

export class GroupRepositorySearchParams<Filter> extends SearchPaginationParamsDefault<Filter> {
  constructor(props: IGroupRepositorySearchParamsProps<Filter>) {
    super(props);
    this.sort = props.sort ?? 'created_at';
    this.sortDirection = props.sortDirection ?? 'desc';
  }
}
