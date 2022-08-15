import { Test } from '@nestjs/testing';

import { PopController, pop_repositories_provider, pop_use_cases_provider } from '../../../src/modules';

export async function createPopModule() {
  return Test.createTestingModule({
    controllers: [PopController],
    providers: [...pop_use_cases_provider, ...pop_repositories_provider]
  }).compile();
}
