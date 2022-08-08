import { Module } from '@nestjs/common';
import { IUserRepository } from '@three-soft/pkg-configuration';
import { user_repositories_provider, user_use_cases_provider } from './module-metadata';

Module({
  imports: [],
  controllers: [],
  providers: [...user_use_cases_provider, ...user_repositories_provider],
  exports: [IUserRepository.name]
});
export class UserModule {}
