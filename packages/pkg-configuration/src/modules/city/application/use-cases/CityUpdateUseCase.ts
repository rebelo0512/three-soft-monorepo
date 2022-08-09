import { BaseUseCase, validateSchema, EntityNotFoundError } from '@three-soft/core-backend';
import { CityUpdateValidationSchema } from '../validators';
import { CityUpdateInputDto, CityDto, ICityRepository } from '../../domain';

export class CityUpdateUseCase extends BaseUseCase<CityUpdateInputDto, CityDto> {
  constructor(private repository: ICityRepository) {
    super();
  }

  async execute(input: CityUpdateInputDto): Promise<CityDto> {
    const dto = await validateSchema<CityUpdateInputDto>(CityUpdateValidationSchema, input);

    const city = await this.getCity(dto);

    return this.repository.update({ ...dto, id: city.city_id });
  }

  private async getCity(dto: CityUpdateInputDto) {
    const city = await this.repository.findById(dto.id);

    if (!city) throw new EntityNotFoundError('Cidade', dto.id, 'id');

    return city;
  }
}
