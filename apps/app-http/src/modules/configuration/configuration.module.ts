import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CompanyModule, AccessControlModule, UserModule } from './modules-internal';

@Module({
  imports: [
    UserModule,
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
      },
      {
        path: 'configuration/api',
        module: UserModule
      }
    ])
  ]
})
export class ConfigurationModule {}
