import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

type MethodObjType = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export function logRequestsMiddleware(req: Request, _res: Response, next: NextFunction) {
  const logger = new Logger();

  const methodObj = {
    GET: '\x1b[34m',
    POST: '\x1b[39m',
    PATCH: '\x1b[33m',
    PUT: '\x1b[30m',
    DELETE: '\x1b[35m'
  };
  const method = req.method as MethodObjType;

  logger.log(
    `${methodObj[method] || methodObj.GET} \n-> Method: ${req.method || 'GET'} -|- Host: ${req.ip} -|- Url: ${
      req.originalUrl
    } \x1b[0m`
  );

  next();
}
