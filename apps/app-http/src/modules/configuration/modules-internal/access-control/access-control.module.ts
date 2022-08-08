import { Module } from '@nestjs/common';
import {
  group_repositories_provider,
  group_use_cases_provider,
  permission_repositories_provider,
  permission_use_cases_provider
} from './module-metadata';
import { GroupController, PermissionController } from './controllers';

@Module({
  controllers: [GroupController, PermissionController],
  providers: [
    ...group_use_cases_provider,
    ...group_repositories_provider,
    ...permission_repositories_provider,
    ...permission_use_cases_provider
  ],
  exports: []
})
export class AccessControlModule {}
