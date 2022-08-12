import { BaseDto } from '@three-soft/core-backend';
import {} from '@three-soft/pkg-configuration';

export interface AttendanceTagDto extends BaseDto {
  att_tag_id: number;
  att_tag_name: string;
}
