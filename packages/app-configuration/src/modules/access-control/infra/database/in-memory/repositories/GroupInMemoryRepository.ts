import { SearchPaginationInMemoryRepository } from '@three-soft/core-backend';
import { IGroupRepository } from '../../../../';
import { GroupDto, GroupSearchInputDto } from '../../../../domain';

export class GroupInMemoryRepository extends SearchPaginationInMemoryRepository<GroupDto> implements IGroupRepository {
  idField: keyof GroupDto = 'group_id';

  async search(input: GroupSearchInputDto): Promise<GroupDto[]> {
    return this.applyFilter(this.items, input.name);
  }

  protected async applyFilter(groups: GroupDto[], filter: string): Promise<GroupDto[]> {
    if (!filter) {
      return groups;
    }

    return groups.filter((category) => this.filterGroups(category, filter));
  }

  /* #region Private Methods */

  private filterGroups(groups: GroupDto, filter: string) {
    return groups.group_name.toLowerCase().includes(filter.toLowerCase());
  }

  /* #endregion */
}
