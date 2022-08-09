import { BaseUseCase } from '@three-soft/core-backend';
import { CityDto, ICityRepository } from '../../domain';

export class CityFindAllUseCase extends BaseUseCase<void, CityDto[]> {
  constructor(private repository: ICityRepository) {
    super();
  }

  async execute(): Promise<CityDto[]> {
    return this.repository.findAll();
  }
}
