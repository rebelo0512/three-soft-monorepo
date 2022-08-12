import { BaseDto } from '@three-soft/core-backend';

export interface AttendanceTagDto extends BaseDto {
  att_tag_id: number;
  att_tag_name: string;
}
