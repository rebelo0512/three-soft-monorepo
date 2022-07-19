import { EntityNotFoundError } from '../../../src';

describe('EntityNotFoundError Unit Tests', () => {
  it('must throw the error', function () {
    try {
      throw new EntityNotFoundError(0);
    } catch (err) {
      expect(err).toBeInstanceOf(EntityNotFoundError);
      expect(err.message).toBe('Entidade não encontrada pelo id: 0');
    }
  });
});
