import { number, object, SchemaOf, string } from 'yup';
import { AttendanceQueueUpdateInputDto } from '../../../domain';

export const AttendanceQueueUpdateValidationSchema: SchemaOf<AttendanceQueueUpdateInputDto> = object().shape({
  id: number().required(),
  name: string().required(),
  color: string().required()
});
