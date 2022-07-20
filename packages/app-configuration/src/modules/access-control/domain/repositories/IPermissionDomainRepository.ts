import {
  PermissionDomainDto,
  PermissionDomainFindAllSystemsOutputDto,
  PermissionDomainFindBySystemNameAndNameInputDto
} from '../dtos';

/* c8 ignore start */
export abstract class IPermissionDomainRepository {
  abstract idField: keyof PermissionDomainDto;

  abstract findAllSystems(): Promise<PermissionDomainFindAllSystemsOutputDto[]>;
  abstract findById(id: number): Promise<PermissionDomainDto>;
  abstract findByName(name: string): Promise<PermissionDomainDto>;
  abstract findBySystemNameAndName(
    input: PermissionDomainFindBySystemNameAndNameInputDto
  ): Promise<PermissionDomainDto>;

  abstract findAllDomainBySystemName(system_name: string): Promise<PermissionDomainDto[]>;
  abstract create(entityDto: PermissionDomainDto): Promise<PermissionDomainDto>;
}
/* c8 ignore stop */
