import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationModule } from '../configuration';
import { checkUserTokenIsValidMiddleware, logRequestsMiddleware } from '../../middlewares';
import { FiberModule } from '../fiber';

@Module({
  imports: [ConfigurationModule, FiberModule]
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkUserTokenIsValidMiddleware).exclude('/configuration/api/auth').forRoutes('(.*)/api/(.*)');

    consumer.apply(logRequestsMiddleware).forRoutes('(.*)');
  }
}
