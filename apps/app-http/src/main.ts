import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { MainModule } from './modules';
import { logRequestsMiddleware } from './middlewares';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter());

  app.use(logRequestsMiddleware);

  await app.listen(3000);

  logger.log('Server started: port: 3000');
}

bootstrap();
