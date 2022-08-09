import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { CityDto, CityFindByIdInputDto, ICityRepository } from '../../domain';

export class CityFindByIdUseCase extends BaseUseCase<CityFindByIdInputDto, CityDto> {
  constructor(private companyRepo: ICityRepository) {
    super();
  }

  async execute({ id }: CityFindByIdInputDto): Promise<CityDto> {
    const company = await this.companyRepo.findById(id);

    if (!company) throw new EntityNotFoundError('Cidade', id, 'id');

    return company;
  }
}
