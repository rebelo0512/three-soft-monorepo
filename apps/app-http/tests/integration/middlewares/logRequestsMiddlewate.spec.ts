/* eslint-disable @typescript-eslint/no-explicit-any */
import { logRequestsMiddleware } from '../../../src/middlewares';

const mockReq = (method: string) => {
  const req: any = {};
  req.method = method;
  req.ip = '127.0.0.1';
  req.originalUrl = 'url';
  return req;
};

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('logRequestsMiddleware Unit Tests', () => {
  it('must call all type methods and not get error', () => {
    const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    methods.forEach((method) => {
      const mockedNext = jest.fn();
      const mockedReq = mockReq(method);
      const mockedRes = mockRes();

      logRequestsMiddleware(mockedReq, mockedRes, mockedNext);
    });
  });
});
