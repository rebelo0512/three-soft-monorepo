import { IBaseRepository } from '@three-soft/core-backend';
import { PermissionDto } from '../dtos';
import {
  PermissionRepositoryFindAllBySystemNameAndDomainNameInput,
  PermissionRepositoryCreateInput,
  PermissionRepositoryFindAllSubDomainsByDomainIdOutput
} from '.';

/* c8 ignore start */
export abstract class IPermissionRepository extends IBaseRepository {
  abstract findAll(): Promise<PermissionDto[]>;
  abstract findAllByDomainName(domain_name: string): Promise<PermissionDto[]>;
  abstract findAllBySubDomainName(sub_domain: string): Promise<PermissionDto[]>;
  abstract findAllSubDomainsByDomainId(
    domain_id: number
  ): Promise<PermissionRepositoryFindAllSubDomainsByDomainIdOutput[]>;

  abstract findAllBySystemNameAndDomainName(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameInput
  ): Promise<PermissionDto[]>;

  abstract findById(id: number): Promise<PermissionDto | null>;
  abstract findByName(name: string): Promise<PermissionDto | null>;
  abstract create(input: PermissionRepositoryCreateInput): Promise<PermissionDto>;
}
/* c8 ignore stop */
