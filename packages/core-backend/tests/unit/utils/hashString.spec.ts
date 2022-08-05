import { hashString } from '../../../src';

describe('hashString Unit Tests', () => {
  it('should hash a string', async () => {
    const hash = await hashString('hello');

    expect(hash).toBeTruthy();
  });
});
