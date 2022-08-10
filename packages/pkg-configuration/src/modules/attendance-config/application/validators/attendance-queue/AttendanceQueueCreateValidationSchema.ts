import { object, SchemaOf, string } from 'yup';
import { AttendanceQueueCreateInputDto } from '../../../domain';

export const AttendanceQueueCreateValidationSchema: SchemaOf<AttendanceQueueCreateInputDto> = object().shape({
  name: string().required(),
  tag: string().required(),
  color: string().required()
});
