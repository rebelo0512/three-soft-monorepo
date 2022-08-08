import { Test } from '@nestjs/testing';

import { UserController, user_repositories_provider, user_use_cases_provider } from '../../../src/modules';

export async function createUserModule() {
  return Test.createTestingModule({
    controllers: [UserController],
    providers: [...user_use_cases_provider, ...user_repositories_provider]
  }).compile();
}
