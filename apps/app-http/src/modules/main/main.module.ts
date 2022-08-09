import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationModule } from '../configuration';
import { checkUserTokenIsValidMiddleware } from '../../middlewares';

@Module({
  imports: [ConfigurationModule]
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkUserTokenIsValidMiddleware).exclude('/configuration/api/auth').forRoutes('(.*)/api/(.*)');
  }
}
