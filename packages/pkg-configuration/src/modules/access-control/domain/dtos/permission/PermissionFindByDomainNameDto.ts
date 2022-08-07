import { PermissionRepositoryFindAllSubDomainsByDomainIdOutput } from '../../../domain';
import { PermissionDto } from './PermissionDto';

export type PermissionFindByDomainNameInputDto = { domain_name: string; system_name: string };

export type PermissionFindByDomainNameOutputDto = {
  permissions: PermissionDto[];
  sub_dom: PermissionRepositoryFindAllSubDomainsByDomainIdOutput[];
};
