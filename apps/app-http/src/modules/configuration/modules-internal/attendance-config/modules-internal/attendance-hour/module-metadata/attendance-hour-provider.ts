import {
  AttendanceHourFindAllUseCase,
  AttendanceHourCreateUseCase,
  AttendanceHourFindByIdUseCase,
  AttendanceHourMysqlRepository,
  AttendanceHourUpdateUseCase,
  IAttendanceHourRepository,
  AttendanceHourDeleteUseCase
} from '@three-soft/pkg-configuration';

export const attendance_hour_use_cases_provider = [
  {
    provide: AttendanceHourFindAllUseCase.name,
    useFactory: (repository: IAttendanceHourRepository) => new AttendanceHourFindAllUseCase(repository),
    inject: [IAttendanceHourRepository.name]
  },
  {
    provide: AttendanceHourFindByIdUseCase.name,
    useFactory: (repository: IAttendanceHourRepository) => new AttendanceHourFindByIdUseCase(repository),
    inject: [IAttendanceHourRepository.name]
  },
  {
    provide: AttendanceHourCreateUseCase.name,
    useFactory: (repository: IAttendanceHourRepository) => new AttendanceHourCreateUseCase(repository),
    inject: [IAttendanceHourRepository.name]
  },
  {
    provide: AttendanceHourUpdateUseCase.name,
    useFactory: (repository: IAttendanceHourRepository) => new AttendanceHourUpdateUseCase(repository),
    inject: [IAttendanceHourRepository.name]
  },
  {
    provide: AttendanceHourDeleteUseCase.name,
    useFactory: (repository: IAttendanceHourRepository) => new AttendanceHourDeleteUseCase(repository),
    inject: [IAttendanceHourRepository.name]
  }
];

export const attendance_hour_repositories_provider = [
  {
    provide: IAttendanceHourRepository.name,
    useClass: AttendanceHourMysqlRepository
  }
];
