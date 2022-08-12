import { object, SchemaOf, string } from 'yup';
import { AttendanceTagCreateInputDto } from '../../../domain';

export const AttendanceTagCreateValidationSchema: SchemaOf<AttendanceTagCreateInputDto> = object().shape({
  name: string().required()
});
