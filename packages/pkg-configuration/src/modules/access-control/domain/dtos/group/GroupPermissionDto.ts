import { BaseDto } from '@three-soft/core-backend';

export interface GroupPermissionDto extends BaseDto {
  group_perm_id: number;
  group_perm_group_id: number;
  group_perm_perm_id: number;
}
