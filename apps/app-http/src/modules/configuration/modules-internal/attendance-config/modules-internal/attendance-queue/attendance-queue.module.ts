import { Module } from '@nestjs/common';
import { attendance_queue_repositories_provider, attendance_queue_use_cases_provider } from './module-metadata';
import { AttendanceQueueController } from './controllers';

@Module({
  controllers: [AttendanceQueueController],
  providers: [...attendance_queue_use_cases_provider, ...attendance_queue_repositories_provider]
})
export class AttendanceQueueModule {}
