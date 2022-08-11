import { Test } from '@nestjs/testing';

import {
  AttendanceQueueController,
  attendance_queue_repositories_provider,
  attendance_queue_use_cases_provider
} from '../../../src/modules';

export async function createAttendanceQueueModule() {
  return Test.createTestingModule({
    controllers: [AttendanceQueueController],
    providers: [...attendance_queue_use_cases_provider, ...attendance_queue_repositories_provider]
  }).compile();
}
