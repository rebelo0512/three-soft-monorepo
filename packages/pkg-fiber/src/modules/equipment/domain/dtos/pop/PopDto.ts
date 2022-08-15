import { BaseDto } from '@three-soft/core-backend';

export interface PopDto extends BaseDto {
  pop_id: number;
  pop_name: string;
  pop_obs: string;
  pop_city_name: string;
  pop_latitude: number;
  pop_longitude: number;
}
