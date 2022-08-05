import { boolean, number, object, SchemaOf, string } from 'yup';
import { UserUpdateInputDto } from '../../domain';

export const UserUpdateValidationSchema: SchemaOf<UserUpdateInputDto> = object().shape({
  id: number().required(),
  name: string().required(),
  email: string().email().required(),
  password: string().optional().nullable().default(null),
  status: boolean().required(),
  group: string().required()
});
