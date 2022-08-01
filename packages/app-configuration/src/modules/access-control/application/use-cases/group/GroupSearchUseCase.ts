import { BaseUseCase } from '@three-soft/core-backend';
import { GroupDto, IGroupRepository } from '../../../domain';

export class GroupSearchUseCase extends BaseUseCase<string, GroupDto[]> {
  constructor(private repository: IGroupRepository) {
    super();
  }

  async execute(name: string): Promise<GroupDto[]> {
    return this.repository.search(name);
  }
}
