import { EntityNotFoundError } from '../../../src';

describe('EntityNotFoundError Unit Tests', () => {
  it('must throw the error', () => {
    try {
      throw new EntityNotFoundError(0);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
      expect(err.message).toBe('Entidade não encontrada pelo(a) id: 0');
    }
  });

  it('must throw the error with custom field', () => {
    try {
      throw new EntityNotFoundError('Name 01', 'name');
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
      expect(err.message).toBe('Entidade não encontrada pelo(a) name: Name 01');
    }
  });
});
