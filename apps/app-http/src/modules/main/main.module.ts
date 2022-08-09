import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationModule } from '../configuration';
import { checkUserTokenIsValid } from '../../middlewares';

@Module({
  imports: [ConfigurationModule]
})
export class MainModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(checkUserTokenIsValid).exclude('/configuration/api/auth').forRoutes('(.*)/api/(.*)');
  }
}
