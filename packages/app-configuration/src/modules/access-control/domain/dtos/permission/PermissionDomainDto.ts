import { BaseDto } from '@three-soft/core-backend';

export interface PermissionDomainDto extends BaseDto {
  perm_dom_id: number;
  perm_system_name: string;
  perm_dom_name: string;
}
