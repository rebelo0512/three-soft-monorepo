import { BaseUseCase } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  PermissionDomainDto,
  PermissionFindAllDomainsBySystemNameInputDto
} from '../../../domain';

export class PermissionFindAllDomainsBySystemNameUseCase extends BaseUseCase<
  PermissionFindAllDomainsBySystemNameInputDto,
  PermissionDomainDto[]
> {
  constructor(private permissionDomainRepository: IPermissionDomainRepository) {
    super();
  }

  async execute(input: PermissionFindAllDomainsBySystemNameInputDto): Promise<PermissionDomainDto[]> {
    return this.permissionDomainRepository.findAllDomainBySystemName(input.system_name);
  }
}
