import { BaseDto } from '@three-soft/core-backend';

export interface AttendanceHourDto extends BaseDto {
  att_hour_id: number;
  att_hour_name: string;
  att_hour_status: boolean;
  att_hour_monday: boolean;
  att_hour_tuesday: boolean;
  att_hour_wednesday: boolean;
  att_hour_thursday: boolean;
  att_hour_friday: boolean;
  att_hour_saturday: boolean;
  att_hour_sunday: boolean;
  att_hour_message: string;
  att_hour_start: string;
  att_hour_end: string;
}
