import { BaseUseCase } from '@three-soft/core-backend';
import { GroupDto, GroupSearchInputDto, IGroupRepository } from '../../../domain';

export class GroupSearchUseCase extends BaseUseCase<GroupSearchInputDto, GroupDto[]> {
  constructor(private repository: IGroupRepository) {
    super();
  }

  async execute(input: GroupSearchInputDto): Promise<GroupDto[]> {
    return this.repository.search(input.name);
  }
}
