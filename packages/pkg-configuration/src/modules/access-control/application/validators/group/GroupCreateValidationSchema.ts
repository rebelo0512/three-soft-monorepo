import { object, SchemaOf, string } from 'yup';
import { GroupCreateInputDto } from '../../../domain';

export const GroupCreateValidationSchema: SchemaOf<GroupCreateInputDto> = object().shape({
  name: string().required()
});
