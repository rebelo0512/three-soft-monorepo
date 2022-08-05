import { BaseUseCase, EntityNotFoundError, validateSchema, hashString } from '@three-soft/core-backend';
import { UserCreateValidationSchema } from '../validators';
import { IGroupRepository } from '../../../access-control';
import { ICompanyRepository } from '../../../company';
import { UserDto, UserCreateInputDto, IUserRepository } from '../../domain';

export class UserCreateUseCase extends BaseUseCase<UserCreateInputDto, UserDto> {
  constructor(
    private repository: IUserRepository,
    private groupRepository: IGroupRepository,
    private companyRepository: ICompanyRepository
  ) {
    super();
  }

  async execute(input: UserCreateInputDto): Promise<UserDto> {
    const dto = await validateSchema<UserCreateInputDto>(UserCreateValidationSchema, input);

    const group = await this.getGroup(dto);
    const company = await this.getCompany(dto);

    const password_hashed = await hashString(dto.password);

    return this.repository.create({
      ...dto,
      password: password_hashed,
      company_id: company.comp_id,
      group_id: group.group_id
    });
  }

  private async getGroup(dto: UserCreateInputDto) {
    const group = await this.groupRepository.findByName(dto.group);

    if (!group) throw new EntityNotFoundError('Grupo', dto.group, 'nome');

    return group;
  }

  private async getCompany(dto: UserCreateInputDto) {
    const company = await this.companyRepository.findByName(dto.company);

    if (!company) throw new EntityNotFoundError('Empresa', dto.company, 'nome');

    return company;
  }
}
