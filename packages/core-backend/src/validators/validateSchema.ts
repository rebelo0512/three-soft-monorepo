import { SchemaOf } from 'yup';
import { ValidationError } from '../errors';

export async function validateSchema<T>(schema: SchemaOf<T>, object: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    schema
      .validate(object, { abortEarly: false, stripUnknown: true })
      .then((validSchema) => {
        resolve((<unknown>validSchema) as T);
      })
      .catch((errors) => {
        reject(new ValidationError(errors.errors, 400));
      });
  });
}
