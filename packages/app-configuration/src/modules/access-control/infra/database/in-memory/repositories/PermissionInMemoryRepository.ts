import { InMemoryRepository } from '@three-soft/core-backend';
import {
  IPermissionRepository,
  PermissionDto,
  PermissionRepositoryFindAllBySystemNameAndDomainNameInput
} from '../../../../domain';

export class PermissionInMemoryRepository extends InMemoryRepository<PermissionDto> implements IPermissionRepository {
  idField: keyof PermissionDto = 'perm_id';
  protected items: PermissionDto[] = [];

  async findAllByDomainName(domain_name: string): Promise<PermissionDto[]> {
    return this.items.filter((i) => i.perm_dom_name === domain_name && !i.perm_sub_dom_name);
  }

  async findAllBySubDomainName(sub_domain: string): Promise<PermissionDto[]> {
    return this.items.filter((i) => i.perm_sub_dom_name === sub_domain);
  }

  async findAllSubDomainsByDomainId(domain_id: number): Promise<PermissionDto[]> {
    const itemsFiltered = this.filterItemsByDomainId(domain_id);

    return this.getAllSubDomains(itemsFiltered);
  }

  async findAllBySystemNameAndDomainName(
    input: PermissionRepositoryFindAllBySystemNameAndDomainNameInput
  ): Promise<PermissionDto[]> {
    return this.items.filter((i) => i.perm_dom_name === input.domain_name && i.perm_system_name === input.system_name);
  }

  async findByName(name: string): Promise<PermissionDto> {
    const item = this.items.find((i) => i.perm_name === name);
    const entityValidated = this.validateEntityExist(item, name, 'nome');
    return entityValidated;
  }

  // #region FindAllSubDomainsByDomainId

  private filterItemsByDomainId(domain_id: number) {
    return this.items.filter((i) => i.perm_dom_id === domain_id && i.perm_sub_dom_name);
  }

  private getAllSubDomains(itemsFiltered: PermissionDto[]) {
    return itemsFiltered.reduce((subDomains, permission) => {
      this.findSubDomainAlreadyStored(subDomains, permission);

      return subDomains;
    }, [] as PermissionDto[]);
  }

  private findSubDomainAlreadyStored(subDomains: PermissionDto[], permission: PermissionDto) {
    const existingSubDomain = subDomains.find((i) => i.perm_sub_dom_name === permission.perm_sub_dom_name);

    if (!existingSubDomain) subDomains.push(permission);
  }

  // #endregion
}
