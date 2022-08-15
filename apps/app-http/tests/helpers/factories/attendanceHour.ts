import { Test } from '@nestjs/testing';

import {
  AttendanceHourController,
  attendance_hour_repositories_provider,
  attendance_hour_use_cases_provider
} from '../../../src/modules';

export async function createAttendanceHourModule() {
  return Test.createTestingModule({
    controllers: [AttendanceHourController],
    providers: [...attendance_hour_use_cases_provider, ...attendance_hour_repositories_provider]
  }).compile();
}
