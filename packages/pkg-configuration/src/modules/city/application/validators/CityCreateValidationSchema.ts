import { number, object, SchemaOf, string } from 'yup';
import { CityCreateInputDto } from '../../domain';

export const CityCreateValidationSchema: SchemaOf<CityCreateInputDto> = object().shape({
  name: string().required(),
  latitude: number().optional().nullable().default(null),
  longitude: number().optional().nullable().default(null)
});
