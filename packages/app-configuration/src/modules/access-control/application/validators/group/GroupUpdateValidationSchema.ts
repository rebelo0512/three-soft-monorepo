import { array, number, object, SchemaOf, string } from 'yup';
import { GroupUpdateInputDto } from '../../../domain';

export const GroupUpdateValidationSchema: SchemaOf<GroupUpdateInputDto> = object().shape({
  id: number().required(),
  permissions: array().of(number().required()).required(),
  system: string().required(),
  domain: string().required(),
  sub_domain: string().optional().nullable().default(null)
});
