import { IBaseRepository } from '@three-soft/core-backend';
import { GroupDto, GroupSearchInputDto } from '../dtos';

export interface IGroupRepository extends IBaseRepository<GroupDto> {
  search(input: GroupSearchInputDto): Promise<GroupDto[]>;
}
