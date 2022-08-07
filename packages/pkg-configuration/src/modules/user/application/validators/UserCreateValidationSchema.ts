import { object, SchemaOf, string } from 'yup';
import { UserCreateInputDto } from '../../domain';

export const UserCreateValidationSchema: SchemaOf<UserCreateInputDto> = object().shape({
  name: string().required(),
  email: string().required(),
  password: string().required(),
  group: string().required(),
  company: string().required()
});
