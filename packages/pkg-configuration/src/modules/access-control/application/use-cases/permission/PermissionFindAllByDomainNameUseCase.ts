import { BaseUseCase, EntityNotFoundError } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionFindByDomainNameInputDto,
  PermissionFindByDomainNameOutputDto
} from '../../../domain';

export class PermissionFindAllByDomainNameUseCase extends BaseUseCase<
  PermissionFindByDomainNameInputDto,
  PermissionFindByDomainNameOutputDto
> {
  constructor(
    private permissionRepository: IPermissionRepository,
    private permissionDomainRepository: IPermissionDomainRepository
  ) {
    super();
  }

  async execute(input: PermissionFindByDomainNameInputDto): Promise<PermissionFindByDomainNameOutputDto> {
    const permissions = await this.permissionRepository.findAllBySystemNameAndDomainName({ ...input });

    const sub_dom = await this.getSubDomains(input);

    return { permissions, sub_dom };
  }

  private async getSubDomains(input: PermissionFindByDomainNameInputDto) {
    const domain = await this.permissionDomainRepository.findBySystemNameAndName({
      system_name: input.system_name,
      name: input.domain_name
    });

    if (!domain) throw new EntityNotFoundError('Domínio da Permissão', input.domain_name, 'nome');

    return this.permissionRepository.findAllSubDomainsByDomainId(domain.perm_dom_id);
  }
}
