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

const prefix = 'configuration/api';

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
        path: `${prefix}/access_control`,
        module: AccessControlModule
      },
      {
        path: prefix,
        module: CompanyModule
      },
      {
        path: prefix,
        module: UserModule
      },
      {
        path: prefix,
        module: AuthModule
      },
      {
        path: prefix,
        module: CityModule
      },
      {
        path: `${prefix}/attendance`,
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
