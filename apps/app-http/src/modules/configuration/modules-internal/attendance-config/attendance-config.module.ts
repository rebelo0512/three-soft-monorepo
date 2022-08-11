import { Module } from '@nestjs/common';
import { AttendanceQueueModule } from './modules-internal';

@Module({
  imports: [AttendanceQueueModule]
})
export class AttendanceConfigModule {}
