import { ValidationError } from '../../../src';

describe('ValidationError Unit Tests', () => {
  it('must throw the error', () => {
    try {
      throw new ValidationError('Error');
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect(err.message).toBe('Error');
    }
  });
});
