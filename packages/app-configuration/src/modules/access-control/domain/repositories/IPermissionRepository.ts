import { IBaseRepository } from '@three-soft/core-backend';
import { PermissionDto } from '../dtos';
import { PermissionRepositoryFindAllBySystemNameAndDomainNameInput } from '.';

/* c8 ignore start */
export abstract class IPermissionRepository extends IBaseRepository<PermissionDto> {
  abstract findAllByDomainName(domain_name: string): Promise<PermissionDto[]>;
  abstract findAllBySubDomainName(sub_domain: string): Promise<PermissionDto[]>;
  abstract findAllSubDomainsByDomainId(domain_id: number): Promise<PermissionDto[]>;
  abstract findAllBySystemNameAndDomainName(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameInput
  ): Promise<PermissionDto[]>;

  abstract findByName(name: string): Promise<PermissionDto>;
}
/* c8 ignore stop */
