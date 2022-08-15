import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import { ICityRepository } from '@three-soft/pkg-configuration';
import { PopCreateValidationSchema } from '../../validators';
import { PopDto, PopCreateInputDto, IPopRepository } from '../../../domain';

export class PopCreateUseCase extends BaseUseCase<PopCreateInputDto, PopDto> {
  constructor(private repository: IPopRepository, private cityRepository: ICityRepository) {
    super();
  }

  async execute(input: PopCreateInputDto): Promise<PopDto> {
    const dto = await validateSchema<PopCreateInputDto>(PopCreateValidationSchema, input);

    const city = await this.getCity(dto);

    return this.repository.create({ ...dto, city: city.city_name });
  }

  private async getCity(dto: PopCreateInputDto) {
    const city = await this.cityRepository.findByName(dto.city);

    if (!city) throw new EntityNotFoundError('Cidade', dto.city, 'nome');

    return city;
  }
}
