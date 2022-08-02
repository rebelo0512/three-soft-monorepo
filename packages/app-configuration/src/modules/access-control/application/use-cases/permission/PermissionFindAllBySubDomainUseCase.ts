import { BaseUseCase } from '@three-soft/core-backend';
import { IPermissionRepository, PermissionDto, PermissionFindAllBySubDomainInputDto } from '../../../domain';

export class PermissionFindAllBySubDomainUseCase extends BaseUseCase<
  PermissionFindAllBySubDomainInputDto,
  PermissionDto[]
> {
  constructor(private permissionRepository: IPermissionRepository) {
    super();
  }

  async execute(input: PermissionFindAllBySubDomainInputDto): Promise<PermissionDto[]> {
    return this.permissionRepository.findAllBySubDomainName(input.sub_dom);
  }
}
