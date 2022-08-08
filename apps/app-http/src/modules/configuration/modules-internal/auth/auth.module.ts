import { Module } from '@nestjs/common';
import { auth_repositories_provider, auth_use_cases_provider } from './module-metadata';
import { AuthController } from './controllers';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [...auth_use_cases_provider, ...auth_repositories_provider]
})
export class AuthModule {}
