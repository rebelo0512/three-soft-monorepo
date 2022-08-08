import { object, SchemaOf, string } from 'yup';
import { AuthInputDto } from '../../domain';

export const AuthValidationSchema: SchemaOf<AuthInputDto> = object().shape({
  email: string().required(),
  password: string().required()
});
