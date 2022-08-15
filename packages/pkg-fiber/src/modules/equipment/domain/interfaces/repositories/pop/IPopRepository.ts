import { PopDto } from '../../../dtos';
import { PopRepositoryCreateInput, PopRepositorySearchInput, PopRepositoryUpdateInput } from './pop-repository';

export abstract class IPopRepository {
  abstract findAll(): Promise<PopDto[]>;
  abstract search(input: PopRepositorySearchInput): Promise<PopDto[]>;
  abstract findById(id: number): Promise<PopDto | null>;
  abstract findByName(name: string): Promise<PopDto | null>;
  abstract create(input: PopRepositoryCreateInput): Promise<PopDto>;
  abstract update(input: PopRepositoryUpdateInput): Promise<PopDto>;
}
