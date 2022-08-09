import { Test } from '@nestjs/testing';

import { AuthController, auth_repositories_provider, auth_use_cases_provider } from '../../../src/modules';

export async function createAuthModule() {
  return Test.createTestingModule({
    controllers: [AuthController],
    providers: [...auth_use_cases_provider, ...auth_repositories_provider]
  }).compile();
}
