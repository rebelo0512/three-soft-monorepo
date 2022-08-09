import { Module } from '@nestjs/common';
import { CompanyController } from './controllers';
import { company_repositories_provider, company_use_cases_provider } from './module-metadata';

@Module({
  controllers: [CompanyController],
  providers: [...company_use_cases_provider, ...company_repositories_provider]
})
export class CompanyModule {}
