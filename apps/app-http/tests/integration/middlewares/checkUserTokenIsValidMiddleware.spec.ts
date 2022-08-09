/* eslint-disable @typescript-eslint/no-explicit-any */
import { encodeToken } from '@three-soft/core-backend';
import { checkUserTokenIsValidMiddleware } from '../../../src/middlewares';

const mockReq = (token: string | null) => {
  const req: any = {
    headers: {}
  };
  req.headers.tokenaccess = token;
  return req;
};

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('checkUserTokenIsValidMiddleware Unit Tests', () => {
  it('should validate token and pass', async () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    const mockedNext = jest.fn();
    const mockedReq = mockReq(token);
    const mockedRes = mockRes();

    await checkUserTokenIsValidMiddleware(mockedReq, mockedRes, mockedNext);
  });

  it('should throw error when token is missing', async () => {
    const mockedNext = jest.fn();
    const mockedReq = mockReq(null);
    const mockedRes = mockRes();

    await expect(() => checkUserTokenIsValidMiddleware(mockedReq, mockedRes, mockedNext)).rejects.toThrowError(
      'Token ausente'
    );
  });

  it('should throw error when token is not valid', async () => {
    const token = encodeToken({ group_id: 1, user_id: 1 });

    const mockedNext = jest.fn();
    const mockedReq = mockReq(token);
    const mockedRes = mockRes();

    process.env.SECRET = 'to throw error';

    await expect(() => checkUserTokenIsValidMiddleware(mockedReq, mockedRes, mockedNext)).rejects.toThrowError(
      'Ocorreu algo errado com o token'
    );
  });
});
