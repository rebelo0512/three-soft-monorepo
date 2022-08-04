export class EntityNotFoundError extends Error {
  constructor(entity: string, value: string | number, field = 'id') {
    super(`${entity} não encontrada pelo(a) ${field}: ${value}`);
    this.name = EntityNotFoundError.name;
  }
}
