import { Test } from '@nestjs/testing';

import { CityController, city_repositories_provider, city_use_cases_provider } from '../../../src/modules';

export async function createCityModule() {
  return Test.createTestingModule({
    controllers: [CityController],
    providers: [...city_use_cases_provider, ...city_repositories_provider]
  }).compile();
}
