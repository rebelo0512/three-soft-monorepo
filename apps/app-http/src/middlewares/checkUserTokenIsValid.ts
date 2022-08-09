import { NextFunction, Request, Response } from 'express';
import { TokenError, validateToken } from '@three-soft/core-backend';

export async function checkUserTokenIsValid(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.tokenaccess as string;

  if (!token) throw new TokenError('missing');

  try {
    validateToken(token);

    next();
  } catch (err) {
    throw new TokenError('expired');
  }
}
