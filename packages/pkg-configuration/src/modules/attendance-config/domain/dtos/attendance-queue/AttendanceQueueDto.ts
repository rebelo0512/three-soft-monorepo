import { BaseDto } from '@three-soft/core-backend';

export interface AttendanceQueueDto extends BaseDto {
  queue_id: number;
  queue_tag: string;
  queue_name: string;
  queue_color: string;
}
