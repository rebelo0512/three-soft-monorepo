import { IBaseRepository } from '@three-soft/core-backend';
import { PermissionDto } from '../dtos';

/* c8 ignore start */
export abstract class IPermissionRepository extends IBaseRepository<PermissionDto> {
  abstract findByDomainName(domain_name: string): Promise<PermissionDto[]>;
  abstract findBySubDomainName(sub_domain: string): Promise<PermissionDto[]>;
  abstract findAllSubDomainsByDomainId(domain_id: number): Promise<PermissionDto[]>;
  abstract findByName(name: string): Promise<PermissionDto>;
}
/* c8 ignore stop */
