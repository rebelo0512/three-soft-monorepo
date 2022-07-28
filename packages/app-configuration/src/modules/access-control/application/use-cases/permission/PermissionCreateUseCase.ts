import { BaseUseCase, validateSchema } from '@three-soft/core-backend';
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

    const permission_domain = await this.permissionDomainRepository.findBySystemNameAndName({
      name: input.domain,
      system_name: input.system_name
    });

    return this.permissionRepository.create({
      perm_id: 0,
      perm_name: dto.name,
      perm_sub_dom_name: dto.sub_domain,
      created_at: new Date(),
      updated_at: new Date(),
      perm_dom_id: permission_domain.perm_dom_id,
      perm_dom_name: permission_domain.perm_dom_name,
      perm_system_name: permission_domain.perm_system_name
    });
  }
}
