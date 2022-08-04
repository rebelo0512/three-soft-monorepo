import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import {
  IGroupRepository,
  IPermissionRepository,
  PermissionDto,
  PermissionFindByGroupIdInputDto
} from '../../../domain';

export class PermissionFindAllByGroupIdUseCase extends BaseUseCase<PermissionFindByGroupIdInputDto, PermissionDto[]> {
  constructor(private permissionRepository: IPermissionRepository, private groupRepository: IGroupRepository) {
    super();
  }

  async execute(input: PermissionFindByGroupIdInputDto): Promise<PermissionDto[]> {
    const group = await this.getGroup(input);

    return this.permissionRepository.findAllByGroupId(group.group_id);
  }

  private async getGroup(input: PermissionFindByGroupIdInputDto) {
    const group = await this.groupRepository.findById(input.group_id);

    if (!group) throw new EntityNotFoundError('Grupo', input.group_id, 'id');

    return group;
  }
}
