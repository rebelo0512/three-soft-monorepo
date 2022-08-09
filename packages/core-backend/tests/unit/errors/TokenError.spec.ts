import { TokenError } from '../../../src';

describe('TokenError Unit Tests', () => {
  it('must throw the error with missing type', () => {
    try {
      throw new TokenError('missing');
    } catch (err) {
      expect(err).toBeInstanceOf(TokenError);
      expect(err.message).toBe('Token ausente');
    }
  });

  it('must throw the error with expired type', () => {
    try {
      throw new TokenError('expired');
    } catch (err) {
      expect(err).toBeInstanceOf(TokenError);
      expect(err.message).toBe('Ocorreu algo errado com o token');
    }
  });
});
