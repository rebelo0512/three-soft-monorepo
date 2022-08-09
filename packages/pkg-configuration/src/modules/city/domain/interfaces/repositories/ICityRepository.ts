import { IBaseRepository } from '@three-soft/core-backend';
import { CityDto } from '../../dtos';
import { CityRepositoryCreateInput, CityRepositoryUpdateInput } from './city-repository';

/* c8 ignore start */
export abstract class ICityRepository extends IBaseRepository {
  abstract findAll(): Promise<CityDto[]>;
  abstract findById(id: number): Promise<CityDto | null>;
  abstract findByName(name: string): Promise<CityDto | null>;
  abstract create(input: CityRepositoryCreateInput): Promise<CityDto>;
  abstract update(input: CityRepositoryUpdateInput): Promise<CityDto>;
}
/* c8 ignore stop */
