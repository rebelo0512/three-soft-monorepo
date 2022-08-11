import {
  AttendanceQueueCreateUseCase,
  AttendanceQueueSearchUseCase,
  AttendanceQueueFindByIdUseCase,
  AttendanceQueueMysqlRepository,
  AttendanceQueueUpdateUseCase,
  IAttendanceQueueRepository,
  AttendanceQueueDeleteUseCase
} from '@three-soft/pkg-configuration';

export const attendance_queue_use_cases_provider = [
  {
    provide: AttendanceQueueSearchUseCase.name,
    useFactory: (repository: IAttendanceQueueRepository) => new AttendanceQueueSearchUseCase(repository),
    inject: [IAttendanceQueueRepository.name]
  },
  {
    provide: AttendanceQueueFindByIdUseCase.name,
    useFactory: (repository: IAttendanceQueueRepository) => new AttendanceQueueFindByIdUseCase(repository),
    inject: [IAttendanceQueueRepository.name]
  },
  {
    provide: AttendanceQueueCreateUseCase.name,
    useFactory: (repository: IAttendanceQueueRepository) => new AttendanceQueueCreateUseCase(repository),
    inject: [IAttendanceQueueRepository.name]
  },
  {
    provide: AttendanceQueueUpdateUseCase.name,
    useFactory: (repository: IAttendanceQueueRepository) => new AttendanceQueueUpdateUseCase(repository),
    inject: [IAttendanceQueueRepository.name]
  },
  {
    provide: AttendanceQueueDeleteUseCase.name,
    useFactory: (repository: IAttendanceQueueRepository) => new AttendanceQueueDeleteUseCase(repository),
    inject: [IAttendanceQueueRepository.name]
  }
];

export const attendance_queue_repositories_provider = [
  {
    provide: IAttendanceQueueRepository.name,
    useClass: AttendanceQueueMysqlRepository
  }
];
