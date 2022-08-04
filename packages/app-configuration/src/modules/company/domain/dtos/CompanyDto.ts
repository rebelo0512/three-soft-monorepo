import { BaseDto } from '@three-soft/core-backend';

export interface CompanyDto extends BaseDto {
  comp_id: number;
  comp_name: string;
  comp_cnpj: string;
  comp_vlan: number;
}
