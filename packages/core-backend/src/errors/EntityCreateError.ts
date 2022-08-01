export class EntityCreateError extends Error {
  constructor(name: string) {
    super(`Ocorreu um erro ao cadastrar a entidade ${name}`);
    this.name = EntityCreateError.name;
  }
}
