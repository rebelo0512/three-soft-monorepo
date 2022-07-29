import { PermissionDomainDto } from '../dtos';
import {
  PermissionDomainRepositoryFindBySystemNameAndNameInput,
  PermissionDomainRepositoryFindAllSystemsOutput
} from '.';

/* c8 ignore start */
export abstract class IPermissionDomainRepository {
  abstract findAllSystems(): Promise<PermissionDomainRepositoryFindAllSystemsOutput[]>;
  abstract findAllDomainBySystemName(system_name: string): Promise<PermissionDomainDto[]>;
  abstract findById(id: number): Promise<PermissionDomainDto | null>;
  abstract findByName(name: string): Promise<PermissionDomainDto | null>;
  abstract findBySystemNameAndName(
    input: PermissionDomainRepositoryFindBySystemNameAndNameInput
  ): Promise<PermissionDomainDto | null>;

  abstract create(entityDto: PermissionDomainDto): Promise<PermissionDomainDto>;
}
/* c8 ignore stop */
