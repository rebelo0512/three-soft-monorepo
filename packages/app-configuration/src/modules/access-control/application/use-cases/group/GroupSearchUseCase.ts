import { BaseUseCase } from '@three-soft/core-backend';
import { GroupDto, GroupSearchInputDto, IGroupRepository } from '../../../domain';

export class GroupSearchUseCase extends BaseUseCase<GroupSearchInputDto, GroupDto[]> {
  constructor(private groupRepository: IGroupRepository) {
    super();
  }

  async execute({ name }: GroupSearchInputDto): Promise<GroupDto[]> {
    return this.groupRepository.search({ name });
  }
}
