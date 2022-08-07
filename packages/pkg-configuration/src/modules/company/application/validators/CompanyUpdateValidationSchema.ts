import { number, object, SchemaOf, string } from 'yup';
import { CompanyUpdateInputDto } from '../../domain';

export const CompanyUpdateValidationSchema: SchemaOf<CompanyUpdateInputDto> = object().shape({
  id: number().min(1).required(),
  name: string().required(),
  cnpj: string().required(),
  vlan: number().min(1).required()
});
