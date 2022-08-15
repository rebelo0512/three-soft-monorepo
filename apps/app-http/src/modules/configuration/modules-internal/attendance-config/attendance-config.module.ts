import { Module } from '@nestjs/common';
import { AttendanceHourModule, AttendanceQueueModule, AttendanceTagModule } from './modules-internal';

@Module({
  imports: [AttendanceQueueModule, AttendanceTagModule, AttendanceHourModule]
})
export class AttendanceConfigModule {}
