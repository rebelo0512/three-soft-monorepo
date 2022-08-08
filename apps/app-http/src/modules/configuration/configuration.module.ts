import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CompanyModule, AccessControlModule, UserModule, AuthModule } from './modules-internal';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    AccessControlModule,
    AuthModule,
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
      },
      {
        path: 'configuration/api',
        module: AuthModule
      }
    ])
  ]
})
export class ConfigurationModule {}
