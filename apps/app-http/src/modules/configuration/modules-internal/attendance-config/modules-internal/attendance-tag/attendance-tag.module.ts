import { Module } from '@nestjs/common';
import { attendance_tag_repositories_provider, attendance_tag_use_cases_provider } from './module-metadata';
import { AttendanceTagController } from './controllers';

@Module({
  controllers: [AttendanceTagController],
  providers: [...attendance_tag_repositories_provider, ...attendance_tag_use_cases_provider]
})
export class AttendanceTagModule {}
