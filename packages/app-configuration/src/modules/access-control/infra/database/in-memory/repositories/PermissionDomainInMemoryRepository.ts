import { EntityNotFoundError } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  PermissionDomainDto,
  PermissionDomainRepositoryFindAllSystemsOutput,
  PermissionDomainRepositoryFindBySystemNameAndNameInput
} from '../../../../domain';

export class PermissionDomainInMemoryRepository implements IPermissionDomainRepository {
  idField: keyof PermissionDomainDto = 'perm_dom_id';
  private items: PermissionDomainDto[] = [];

  async findAllSystems(): Promise<PermissionDomainRepositoryFindAllSystemsOutput[]> {
    return this.items.reduce((acc, item) => {
      const existingSystem = acc.find((system) => system.perm_system_name === item.perm_system_name);

      if (!existingSystem) {
        acc.push({ perm_system_name: item.perm_system_name });
      }

      return acc;
    }, [] as PermissionDomainRepositoryFindAllSystemsOutput[]);
  }

  async findById(id: number): Promise<PermissionDomainDto> {
    const item = this.items.find((i) => Number(i[this.idField]) === id);
    const entityValidated = this.validateEntityExist(item, 'id', id);
    return entityValidated;
  }

  async findByName(name: string): Promise<PermissionDomainDto> {
    const item = this.items.find((i) => i.perm_dom_name === name);
    const entityValidated = this.validateEntityExist(item, 'nome', name);
    return entityValidated;
  }

  async findBySystemNameAndName({
    name,
    system_name
  }: PermissionDomainRepositoryFindBySystemNameAndNameInput): Promise<PermissionDomainDto> {
    const item = this.items.find((i) => i.perm_system_name === system_name && i.perm_dom_name === name);
    const entityValidated = this.validateEntityExist(item, 'nome', name);
    return entityValidated;
  }

  async findAllDomainBySystemName(system_name: string): Promise<PermissionDomainDto[]> {
    return this.items.filter((i) => i.perm_system_name === system_name);
  }

  async create(entityDto: PermissionDomainDto): Promise<PermissionDomainDto> {
    const item = { ...entityDto, [this.idField]: this.items.length + 1 };
    this.items.push(item);
    return item;
  }

  /* #region Private Methods */

  private validateEntityExist(entity: PermissionDomainDto | undefined, field: string, value: number | string) {
    if (entity === null || entity === undefined) {
      throw new EntityNotFoundError(value, field);
    }

    return entity;
  }

  /* #endregion */
}
