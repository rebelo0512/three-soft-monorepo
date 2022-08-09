import { encodeToken, validateToken } from '../../../src';

describe('validateToken', () => {
  it('should return true if token is valid', () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    const is_token_valid = validateToken(token);

    expect(is_token_valid).toBeTruthy();
  });

  it('should throw error if token is invalid', () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    process.env.SECRET = 'to throw error';

    try {
      validateToken(token);
    } catch (err) {
      expect(err).toEqual({
        name: 'JsonWebTokenError',
        message: 'invalid signature'
      });
    }
  });
});
