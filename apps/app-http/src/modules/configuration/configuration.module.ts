import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import {
  CompanyModule,
  AccessControlModule,
  UserModule,
  AuthModule,
  CityModule,
  AttendanceConfigModule,
  AttendanceQueueModule,
  AttendanceTagModule,
  AttendanceHourModule
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
      },
      {
        path: 'configuration/api/attendance',
        module: AttendanceConfigModule,
        children: [
          {
            path: 'queue',
            module: AttendanceQueueModule
          },
          {
            path: 'tag',
            module: AttendanceTagModule
          },
          {
            path: 'hour',
            module: AttendanceHourModule
          }
        ]
      }
    ])
  ]
})
export class ConfigurationModule {}
