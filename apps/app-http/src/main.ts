import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { MainModule } from './modules/main';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter());
  await app.listen(3000);
}

bootstrap();
