import { BaseDto } from '@three-soft/core-backend';
import { PermissionDto } from '../permission';

export interface GroupDto extends BaseDto {
  group_id: number;
  group_name: string;
  permissions?: PermissionDto[];
}
