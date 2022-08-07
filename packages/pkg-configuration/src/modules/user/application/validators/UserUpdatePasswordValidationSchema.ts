import { number, object, SchemaOf, string } from 'yup';
import { UserUpdatePasswordInputDto } from '../../domain';

export const UserUpdatePasswordValidationSchema: SchemaOf<UserUpdatePasswordInputDto> = object().shape({
  id: number().required(),
  password: string().required()
});
