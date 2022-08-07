import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
import { CompanyCreateValidationSchema } from '../validators';
import { CompanyCreateInputDto, CompanyDto, ICompanyRepository } from '../../domain';

export class CompanyCreateUseCase extends BaseUseCase<CompanyCreateInputDto, CompanyDto> {
  constructor(private repository: ICompanyRepository) {
    super();
  }

  async execute(input: CompanyCreateInputDto): Promise<CompanyDto> {
    const dto = await validateSchema<CompanyCreateInputDto>(CompanyCreateValidationSchema, input);

    return this.repository.create(dto);
  }
}
