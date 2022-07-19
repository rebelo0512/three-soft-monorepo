import { BaseUseCase } from '@three-soft/core-backend';
import { GroupDto, IGroupRepository } from '../../../domain';

export class GroupFindAllUseCase extends BaseUseCase<null, GroupDto[]> {
  constructor(private groupRepository: IGroupRepository) {
    super();
  }

  async execute(): Promise<GroupDto[]> {
    return this.groupRepository.findAll();
  }
}
