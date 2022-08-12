import { Test } from '@nestjs/testing';

import {
  AttendanceTagController,
  attendance_tag_repositories_provider,
  attendance_tag_use_cases_provider
} from '../../../src/modules';

export async function createAttendanceTagModule() {
  return Test.createTestingModule({
    controllers: [AttendanceTagController],
    providers: [...attendance_tag_use_cases_provider, ...attendance_tag_repositories_provider]
  }).compile();
}
