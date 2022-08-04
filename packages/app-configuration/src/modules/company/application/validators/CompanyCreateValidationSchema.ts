import { number, object, SchemaOf, string } from 'yup';
import { CompanyCreateInputDto } from '../../domain';

export const CompanyCreateValidationSchema: SchemaOf<CompanyCreateInputDto> = object().shape({
  name: string().required(),
  cnpj: string().required(),
  vlan: number().required()
});
