import { object, SchemaOf, string } from 'yup';
import { PermissionCreateInputDto } from '../../../domain';

export const PermissionCreateValidationSchema: SchemaOf<PermissionCreateInputDto> = object().shape({
  system_name: string().required(),
  domain: string().required(),
  name: string().required(),
  sub_domain: string().optional().nullable().default(null)
});
