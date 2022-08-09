import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthenticateError, EntityNotFoundError, TokenError, ValidationError } from '@three-soft/core-backend';
import { Request } from 'express';

@Catch()
export class GlobalExceptionMiddleware implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost, private logger: Logger) {}

  catch(exception: Error, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();

    this.logger.error(
      `\n-> Method: ${req.method}\n-> Host: ${req.ip}\n-> Url: ${req.originalUrl}\n-> Message: ${exception.message}`,
      '',
      'Filter - ExceptionGlobal'
    );

    if (process.env.NODE_ENV !== 'production') {
      this.logger.error(exception.stack);
    }

    const response = {
      body: {
        status: 'error',
        message: `Internal Server Error\n ${exception.message}`
      },
      statusCode: 500
    };

    if (exception instanceof AuthenticateError || exception instanceof TokenError) {
      response.body.message = exception.message;
      response.statusCode = 401;
    }

    if (exception instanceof ValidationError) {
      response.body.message = exception.message;
      response.statusCode = 400;
    }

    if (exception instanceof EntityNotFoundError) {
      response.body.message = exception.message;
      response.statusCode = 404;
    }

    httpAdapter.reply(ctx.getResponse(), response.body, response.statusCode);
  }
}
