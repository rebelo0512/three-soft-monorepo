import { hash } from 'bcrypt';

export async function hashString(str: string, salt = 10): Promise<string> {
  return hash(str, salt);
}
