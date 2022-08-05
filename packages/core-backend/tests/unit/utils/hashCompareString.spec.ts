import { hashComparedString, hashString } from '../../../src';

describe('hashCompareString Unit Tests', () => {
  it('should hash a string', async () => {
    const hash = await hashString('hello');

    const is_same = hashComparedString(hash, 'hello');

    expect(is_same).toBeTruthy();
  });
});
