import { Module } from '@nestjs/common';
import { attendance_hour_repositories_provider, attendance_hour_use_cases_provider } from './module-metadata';
import { AttendanceHourController } from './controllers';

@Module({
  controllers: [AttendanceHourController],
  providers: [...attendance_hour_repositories_provider, ...attendance_hour_use_cases_provider]
})
export class AttendanceHourModule {}
