import { Test } from '@nestjs/testing';

import {
  GroupController,
  group_repositories_provider,
  group_use_cases_provider,
  PermissionController,
  permission_repositories_provider,
  permission_use_cases_provider
} from '../../../src/modules';

export async function createAccessControlModule() {
  return Test.createTestingModule({
    controllers: [GroupController, PermissionController],
    providers: [
      ...group_use_cases_provider,
      ...group_repositories_provider,
      ...permission_repositories_provider,
      ...permission_use_cases_provider
    ]
  }).compile();
}
