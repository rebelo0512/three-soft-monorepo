import { BaseUseCase } from '@three-soft/core-backend';
import { IPermissionDomainRepository, PermissionFindAllSystemsOutputDto } from '../../../domain';

export class PermissionFindAllSystemsUseCase extends BaseUseCase<void, PermissionFindAllSystemsOutputDto[]> {
  constructor(private permissionDomainRepository: IPermissionDomainRepository) {
    super();
  }

  async execute(): Promise<PermissionFindAllSystemsOutputDto[]> {
    return this.permissionDomainRepository.findAllSystems();
  }
}
