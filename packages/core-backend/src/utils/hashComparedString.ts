import { compare } from 'bcrypt';

export async function hashComparedString(hash: string, value: string): Promise<boolean> {
  return compare(value, hash);
}
