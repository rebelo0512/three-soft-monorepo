import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { MainModule } from './modules';
import { logRequestsMiddleware } from './middlewares';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter());

  app.use(logRequestsMiddleware);
  app.enableCors();

  const port = Number(process.env.APP_HTTP_PORT) || 20150;
  await app.listen(port);

  logger.log(`Server started: port: ${port}`);
}

bootstrap();
