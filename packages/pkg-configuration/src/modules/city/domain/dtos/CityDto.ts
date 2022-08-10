import { BaseDto } from '@three-soft/core-backend';

export interface CityDto extends BaseDto {
  city_id: number;
  city_name: string;
  city_latitude: number;
  city_longitude: number;
}
