import { BaseUseCase, validateSchema, EntityNotFoundError } from '@three-soft/core-backend';
import { CompanyUpdateValidationSchema } from '../validators';
import { CompanyUpdateInputDto, CompanyDto, ICompanyRepository } from '../../domain';

export class CompanyUpdateUseCase extends BaseUseCase<CompanyUpdateInputDto, CompanyDto> {
  constructor(private repository: ICompanyRepository) {
    super();
  }

  async execute(input: CompanyUpdateInputDto): Promise<CompanyDto> {
    const dto = await validateSchema<CompanyUpdateInputDto>(CompanyUpdateValidationSchema, input);

    const company = await this.getCompany(dto);

    return this.repository.update({ ...dto, id: company.comp_id });
  }

  private async getCompany(dto: CompanyUpdateInputDto) {
    const company = await this.repository.findById(dto.id);

    if (!company) throw new EntityNotFoundError('Empresa', dto.id, 'id');

    return company;
  }
}
