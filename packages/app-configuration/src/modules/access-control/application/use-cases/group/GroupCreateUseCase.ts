import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { GroupCreateInputDto, GroupDto, IGroupRepository } from '../../../domain';
import { GroupCreateValidationSchema } from '../../validators';

export class GroupCreateUseCase extends BaseUseCase<GroupCreateInputDto, GroupDto> {
  constructor(private groupRepository: IGroupRepository) {
    super();
  }

  async execute(input: GroupCreateInputDto): Promise<GroupDto> {
    const dto = await validateSchema<GroupCreateInputDto>(GroupCreateValidationSchema, input);

    return this.groupRepository.create(dto.name);
  }
}
