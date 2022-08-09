import { verify } from 'jsonwebtoken';

export function validateToken(token: string) {
  const is_valid = verify(token, String(process.env.SECRET));

  return !!is_valid;
}
