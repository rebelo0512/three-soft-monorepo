import { Module } from '@nestjs/common';
import { ICompanyRepository } from '@three-soft/pkg-configuration';
import { CompanyController } from './controllers';
import { company_repositories_provider, company_use_cases_provider } from './module-metadata';

@Module({
  controllers: [CompanyController],
  providers: [...company_use_cases_provider, ...company_repositories_provider],
  exports: [ICompanyRepository.name]
})
export class CompanyModule {}
