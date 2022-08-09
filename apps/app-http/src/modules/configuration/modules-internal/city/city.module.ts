import { Module } from '@nestjs/common';
import { city_repositories_provider, city_use_cases_provider } from './module-metadata';

@Module({
  controllers: [],
  providers: [...city_use_cases_provider, ...city_repositories_provider]
})
export class CityModule {}
