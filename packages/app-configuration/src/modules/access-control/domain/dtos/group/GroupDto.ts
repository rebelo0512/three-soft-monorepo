import { BaseDto } from '@three-soft/core-backend';

export interface GroupDto extends BaseDto {
  group_id: number;
  group_name: string;
}
