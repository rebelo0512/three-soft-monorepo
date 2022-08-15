import { number, object, SchemaOf, string } from 'yup';
import { PopUpdateInputDto } from '../../../domain';

export const PopUpdateValidationSchema: SchemaOf<PopUpdateInputDto> = object().shape({
  id: number().required(),
  name: string().required(),
  latitude: number().optional().nullable().default(null),
  longitude: number().optional().nullable().default(null)
});
