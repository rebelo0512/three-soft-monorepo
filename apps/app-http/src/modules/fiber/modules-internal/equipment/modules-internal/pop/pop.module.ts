import { Module } from '@nestjs/common';
import { pop_repositories_provider, pop_use_cases_provider } from './module-metadata';
import { PopController } from './controllers';

@Module({
  controllers: [PopController],
  providers: [...pop_repositories_provider, ...pop_use_cases_provider]
})
export class PopModule {}
