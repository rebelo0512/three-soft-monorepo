import { number, object, SchemaOf, string } from 'yup';
import { CityUpdateInputDto } from '../../domain';

export const CityUpdateValidationSchema: SchemaOf<CityUpdateInputDto> = object().shape({
  id: number().min(1).required(),
  name: string().required(),
  latitude: number().optional().nullable().default(null),
  longitude: number().optional().nullable().default(null)
});
