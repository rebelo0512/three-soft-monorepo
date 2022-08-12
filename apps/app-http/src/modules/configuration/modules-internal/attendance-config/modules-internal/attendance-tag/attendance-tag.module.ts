import { Module } from '@nestjs/common';
import { attendance_tag_repositories_provider, attendance_tag_use_cases_provider } from './module-metadata';

@Module({
  controllers: [],
  providers: [...attendance_tag_repositories_provider, ...attendance_tag_use_cases_provider]
})
export class AttendanceTagModule {}
