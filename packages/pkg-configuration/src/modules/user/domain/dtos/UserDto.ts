import { BaseDto, OmitBaseDto } from '@three-soft/core-backend';
import { GroupDto } from '../../../access-control';
import { CompanyDto } from '../../../company';

export interface UserDto extends BaseDto, OmitBaseDto<CompanyDto>, OmitBaseDto<GroupDto> {
  user_id: number;
  user_name: string;
  user_email: string;
  user_password: string;
  user_status: boolean;
  user_technical: boolean;
  user_last_token: string;
  user_mobile_token: string;
}
