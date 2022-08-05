import { encodeToken } from '../../../src';

describe('encodeToken Unit Tests', () => {
  it('should encode a token', () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    expect(token).toBeTruthy();
  });
});
