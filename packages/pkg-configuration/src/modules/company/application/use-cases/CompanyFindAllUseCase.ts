import { BaseUseCase } from '@three-soft/core-backend';
import { CompanyDto, ICompanyRepository } from '../../domain';

export class CompanyFindAllUseCase extends BaseUseCase<void, CompanyDto[]> {
  constructor(private repository: ICompanyRepository) {
    super();
  }

  async execute(): Promise<CompanyDto[]> {
    return this.repository.findAll();
  }
}
