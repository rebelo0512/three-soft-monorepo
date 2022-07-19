import { SearchPaginationInMemoryRepository } from '@three-soft/core-backend';
import { IGroupRepository } from '../../../../';
import { GroupDto } from '../../../../domain';

export class GroupInMemoryRepository extends SearchPaginationInMemoryRepository<GroupDto> implements IGroupRepository {
  idField: keyof GroupDto = 'group_id';

  protected async applyFilter(groups: GroupDto[], filter: string): Promise<GroupDto[]> {
    if (!filter) {
      return groups;
    }

    return groups.filter((category) => this.filterCategories(category, filter));
  }

  /* #region Private Methods */

  private filterCategories(groups: GroupDto, filter: string) {
    return groups.group_name.toLowerCase().includes(filter.toLowerCase());
  }

  /* #endregion */
}
