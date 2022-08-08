import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CompanyModule, AccessControlModule } from './modules-internal';

@Module({
  imports: [
    CompanyModule,
    AccessControlModule,
    RouterModule.register([
      {
        path: 'configuration/api',
        module: CompanyModule
      },
      {
        path: 'configuration/api/access_control',
        module: AccessControlModule
      }
    ])
  ]
})
export class ConfigurationModule {}
