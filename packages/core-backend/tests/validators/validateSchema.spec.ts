import { object, number, string, date } from 'yup';
import { BaseDto, validateSchema } from '../../src';

interface StubDto extends BaseDto {
  id: number;
  name: string;
}

const stubSchema = object().shape({
  id: number().required(),
  name: string().required(),
  created_at: date().optional().default(new Date()),
  updated_at: date().optional().default(new Date())
});

describe('validateSchema Unit Test', () => {
  it('should validate the schema and return it', async () => {
    const stubDto = await validateSchema<StubDto>(stubSchema, { id: 1, name: 'Name 01' });

    expect(stubDto).toEqual({
      id: 1,
      name: 'Name 01',
      created_at: expect.any(Date),
      updated_at: expect.any(Date)
    });
  });

  it('should throw error when one prop is invalid', async () => {
    await expect(
      async () => await validateSchema<StubDto>(stubSchema, { id: 'to thro error', name: 'Name 01' })
    ).rejects.toThrowError(
      'Error: id must be a `number` type, but the final value was: `NaN` (cast from the value `"to thro error"`).'
    );
  });

  it('should throw error when many props is invalid', async () => {
    await expect(
      async () =>
        await validateSchema<StubDto>(stubSchema, { id: 'to thro error', name: true, created_at: 'to throw error' })
    ).rejects.toThrowError(
      'Error: id must be a `number` type, but the final value was: `NaN` (cast from the value `"to thro error"`).,created_at must be a `date` type, but the final value was: `Invalid Date` (cast from the value `"to throw error"`).'
    );
  });
});
