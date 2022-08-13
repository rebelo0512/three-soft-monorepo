import { boolean, number, object, SchemaOf, string } from 'yup';
import { AttendanceHourUpdateInputDto } from '../../../domain';

export const AttendanceHourUpdateValidationSchema: SchemaOf<AttendanceHourUpdateInputDto> = object().shape({
  id: number().min(1).required(),
  name: string().required(),
  status: boolean().optional().default(true),
  message: string().required(),
  start: string().required(),
  end: string().required(),
  friday: boolean().optional().default(false),
  monday: boolean().optional().default(false),
  tuesday: boolean().optional().default(false),
  wednesday: boolean().optional().default(false),
  thursday: boolean().optional().default(false),
  saturday: boolean().optional().default(false),
  sunday: boolean().optional().default(false)
});
