import { Test } from '@nestjs/testing';

import { CompanyController, company_repositories_provider, company_use_cases_provider } from '../../../src/modules';

export async function createCompanyModule() {
  return Test.createTestingModule({
    controllers: [CompanyController],
    providers: [...company_use_cases_provider, ...company_repositories_provider]
  }).compile();
}
