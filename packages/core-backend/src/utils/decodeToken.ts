import { decode } from 'jsonwebtoken';

type JWTToken = {
  id: number;
  group_id: number;
  exp: number;
  iat: number;
};

export function decodeToken(token: string): JWTToken {
  return decode(token) as JWTToken;
}
