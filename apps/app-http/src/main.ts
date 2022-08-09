import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import helmet from 'helmet';
import { MainModule } from './modules';
import { GlobalExceptionMiddleware } from './middlewares/GlobalExceptionMiddleware';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter());

  const httpAdapter = app.get(HttpAdapterHost);

  app.useGlobalFilters(new GlobalExceptionMiddleware(httpAdapter, logger));
  app.enableCors();
  app.use(helmet());

  return app;
}

bootstrap().then(async (app) => {
  const port = Number(process.env.APP_HTTP_PORT) || 20150;

  await app.listen(port);

  logger.log(`Server started: port: ${port}`, 'NestApplication');
});
