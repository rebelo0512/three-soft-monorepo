import { EntityCreateError } from '../../../src/errors';

describe('EntityCreateError Unit Tests', () => {
  it('must throw the error', () => {
    try {
      throw new EntityCreateError('EntidadeStub');
    } catch (err) {
      expect(err).toBeInstanceOf(EntityCreateError);
      expect(err.message).toBe('Ocorreu um erro ao cadastrar a entidade EntidadeStub');
    }
  });
});
