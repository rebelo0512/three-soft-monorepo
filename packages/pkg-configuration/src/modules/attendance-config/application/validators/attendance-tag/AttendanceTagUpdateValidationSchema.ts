import { number, object, SchemaOf, string } from 'yup';
import { AttendanceTagUpdateInputDto } from '../../../domain';

export const AttendanceTagUpdateValidationSchema: SchemaOf<AttendanceTagUpdateInputDto> = object().shape({
  id: number().min(1).required(),
  name: string().required()
});
