import { BaseDto, OmitBaseDto } from '@three-soft/core-backend';
import { PermissionDomainDto } from './PermissionDomainDto';

export interface PermissionDto extends BaseDto, OmitBaseDto<PermissionDomainDto> {
  perm_id: number;
  perm_name: string;
  perm_sub_dom_name: string | null;
  perm_dom_id: number;
}
