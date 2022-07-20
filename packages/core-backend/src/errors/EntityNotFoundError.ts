export class EntityNotFoundError extends Error {
  constructor(value: string | number, field = 'id') {
    super(`Entidade não encontrada pelo(a) ${field}: ${value}`);
    this.name = EntityNotFoundError.name;
  }
}
