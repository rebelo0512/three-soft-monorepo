import { IBaseRepository } from '@three-soft/core-backend';
import { CompanyDto } from '../../dtos';
import { CompanyRepositoryCreateInput, CompanyRepositoryUpdateInput } from '.';

/* c8 ignore start */
export abstract class ICompanyRepository extends IBaseRepository {
  abstract findAll(): Promise<CompanyDto[]>;
  abstract findById(id: number): Promise<CompanyDto | null>;
  abstract findByName(name: string): Promise<CompanyDto | null>;
  abstract create(input: CompanyRepositoryCreateInput): Promise<CompanyDto>;
  abstract update(input: CompanyRepositoryUpdateInput): Promise<CompanyDto>;
}
/* c8 ignore stop */
