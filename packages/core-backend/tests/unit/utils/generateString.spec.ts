import { generateString } from '../../../src';

describe('generateString Unit Tests', () => {
  it('should generate some string', () => {
    const string = generateString(10);

    expect(string.length).toBe(11);
  });
});
