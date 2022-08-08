import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { user_repositories_provider, user_use_cases_provider } from './module-metadata';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [...user_use_cases_provider, ...user_repositories_provider]
})
export class UserModule {}
