import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { CityCreateValidationSchema } from '../validators';
import { CityCreateInputDto, CityDto, ICityRepository } from '../../domain';

export class CityCreateUseCase extends BaseUseCase<CityCreateInputDto, CityDto> {
  constructor(private repository: ICityRepository) {
    super();
  }

  async execute(input: CityCreateInputDto): Promise<CityDto> {
    const dto = await validateSchema<CityCreateInputDto>(CityCreateValidationSchema, input);

    return this.repository.create(dto);
  }
}
