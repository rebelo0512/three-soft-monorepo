import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import { CompanyDto } from '../../domain/dtos/CompanyDto';
import { CompanyFindByIdInputDto, ICompanyRepository } from '../../domain';

export class CompanyFindByIdUseCase extends BaseUseCase<CompanyFindByIdInputDto, CompanyDto> {
  constructor(private companyRepo: ICompanyRepository) {
    super();
  }

  async execute({ id }: CompanyFindByIdInputDto): Promise<CompanyDto> {
    const company = await this.companyRepo.findById(id);

    if (!company) throw new EntityNotFoundError('Empresa', id, 'id');

    return company;
  }
}
