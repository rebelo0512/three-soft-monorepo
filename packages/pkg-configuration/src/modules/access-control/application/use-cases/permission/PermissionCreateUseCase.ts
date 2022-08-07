import { BaseUseCase, EntityNotFoundError, validateSchema } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionCreateInputDto,
  PermissionDto
} from '../../../domain';
import { PermissionCreateValidationSchema } from '../../validators';

export class PermissionCreateUseCase extends BaseUseCase<PermissionCreateInputDto, PermissionDto> {
  constructor(
    private permissionRepository: IPermissionRepository,
    private permissionDomainRepository: IPermissionDomainRepository
  ) {
    super();
  }

  async execute(input: PermissionCreateInputDto): Promise<PermissionDto> {
    const dto = await validateSchema<PermissionCreateInputDto>(PermissionCreateValidationSchema, input);

    const permission_domain = await this.getPermissionDomain(input);

    return this.permissionRepository.create({
      name: dto.name,
      sub_domain: dto.sub_domain,
      domain_id: permission_domain?.perm_dom_id
    });
  }

  private async getPermissionDomain(input: PermissionCreateInputDto) {
    const permission_domain = await this.permissionDomainRepository.findBySystemNameAndName({
      name: input.domain,
      system_name: input.system_name
    });

    if (!permission_domain) throw new EntityNotFoundError('Domínio da Permissão', input.domain, 'nome');

    return permission_domain;
  }
}
