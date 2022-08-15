import { number, object, SchemaOf, string } from 'yup';
import { PopCreateInputDto } from '../../../domain';

export const PopCreateValidationSchema: SchemaOf<PopCreateInputDto> = object().shape({
  name: string().required(),
  city: string().required(),
  latitude: number().optional().nullable().default(null),
  longitude: number().optional().nullable().default(null)
});
