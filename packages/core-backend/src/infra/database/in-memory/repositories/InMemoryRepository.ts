import { IBaseRepository, EntityNotFoundError } from '../../../../';

export class InMemoryRepository<EntityDto> implements IBaseRepository<EntityDto> {
  protected idField: string;
  protected items: EntityDto[] = [];

  async findAll(): Promise<EntityDto[]> {
    return this.items;
  }

  async findById(id: number): Promise<EntityDto> {
    const item = this.items.find((i) => i[this.idField] === id);
    const entityValidated = this.validateEntityExist(item, id);
    return entityValidated;
  }

  async create(entity: EntityDto): Promise<void> {
    this.items.push(entity);
  }

  async update(entity: EntityDto): Promise<void> {
    const itemIndex = this.items.findIndex((i) => i[this.idField] === entity[this.idField]);
    this.validateNumberIsValid(itemIndex, entity[this.idField]);
    this.items[itemIndex] = entity;
  }

  async delete(id: number): Promise<void> {
    const itemIndex = this.items.findIndex((i) => i[this.idField] === id);
    this.validateNumberIsValid(itemIndex, id);
    this.items.splice(itemIndex, 1);
  }

  /* #region Private Methods */

  private validateEntityExist(entity: EntityDto | undefined, id: number) {
    if (entity === null || entity === undefined) {
      throw new EntityNotFoundError(id);
    }

    return entity;
  }

  private validateNumberIsValid(entity: EntityDto | number, id: number) {
    if (typeof entity === 'number' && entity === -1) {
      throw new EntityNotFoundError(id);
    }
  }

  /* #endregion */
}
