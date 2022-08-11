import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import {
  CompanyModule,
  AccessControlModule,
  UserModule,
  AuthModule,
  CityModule,
  AttendanceConfigModule
} from './modules-internal';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    AccessControlModule,
    AuthModule,
    CityModule,
    AttendanceConfigModule,
    RouterModule.register([
      {
        path: 'configuration/api/access_control',
        module: AccessControlModule
      },
      {
        path: 'configuration/api/attendance',
        module: AttendanceConfigModule
      },
      {
        path: 'configuration/api',
        module: CompanyModule
      },
      {
        path: 'configuration/api',
        module: UserModule
      },
      {
        path: 'configuration/api',
        module: AuthModule
      },
      {
        path: 'configuration/api',
        module: CityModule
      }
    ])
  ]
})
export class ConfigurationModule {}
