export abstract class IBaseRepository<EntityDto> {
  abstract findAll(): Promise<EntityDto[]>;
  abstract findById(id: number): Promise<EntityDto>;
  abstract create(entity: EntityDto): Promise<EntityDto>;
  abstract update(entity: EntityDto): Promise<void>;
  abstract delete(id: number): Promise<void>;
}
