import { BaseDto } from '@three-soft/core-backend';

export interface PermissionDto extends BaseDto {
  perm_id: number;
  perm_name: string;
  perm_sub_dom_name: string;
  perm_dom_id: number;
}
