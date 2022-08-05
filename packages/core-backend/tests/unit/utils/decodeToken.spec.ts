import { decodeToken, encodeToken } from '../../../src';

describe('decodeToken Unit Tests', () => {
  it('should decode a valid token', () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    const token_decoded = decodeToken(token);

    expect(token_decoded).toEqual({ group_id: 1, id: 1, exp: expect.any(Number), iat: expect.any(Number) });
  });
});
