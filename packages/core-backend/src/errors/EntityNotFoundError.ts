export class EntityNotFoundError extends Error {
  constructor(id: number) {
    super(`Entidade não encontrada pelo id: ${id}`);
    this.name = EntityNotFoundError.name;
  }
}
