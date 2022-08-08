import { AuthenticateError } from '../../../src/errors';

describe('EntityCreateError Unit Tests', () => {
  it('must throw the error with prop_wrong type', () => {
    try {
      throw new AuthenticateError('prop_wrong');
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticateError);
      expect(err.message).toBe('Email ou senha incorretos');
    }
  });

  it('must throw the error with inactive type', () => {
    try {
      throw new AuthenticateError('inactive');
    } catch (err) {
      expect(err).toBeInstanceOf(AuthenticateError);
      expect(err.message).toBe('Usuário inativo');
    }
  });
});
