import { PermissionDomainDto } from '../dtos';
import {
  PermissionDomainRepositoryFindBySystemNameAndNameInput,
  PermissionDomainRepositoryFindAllSystemsOutput
} from '.';

/* c8 ignore start */
export abstract class IPermissionDomainRepository {
  abstract idField: keyof PermissionDomainDto;

  abstract findAllSystems(): Promise<PermissionDomainRepositoryFindAllSystemsOutput[]>;
  abstract findAllDomainBySystemName(system_name: string): Promise<PermissionDomainDto[]>;
  abstract findById(id: number): Promise<PermissionDomainDto>;
  abstract findByName(name: string): Promise<PermissionDomainDto>;
  abstract findBySystemNameAndName(
    input: PermissionDomainRepositoryFindBySystemNameAndNameInput
  ): Promise<PermissionDomainDto>;

  abstract create(entityDto: PermissionDomainDto): Promise<PermissionDomainDto>;
}
/* c8 ignore stop */
