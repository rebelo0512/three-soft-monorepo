import {
  AttendanceTagCreateUseCase,
  AttendanceTagSearchUseCase,
  AttendanceTagFindByIdUseCase,
  AttendanceTagMysqlRepository,
  AttendanceTagUpdateUseCase,
  IAttendanceTagRepository,
  AttendanceTagDeleteUseCase,
  AttendanceTagFindAllUseCase
} from '@three-soft/pkg-configuration';

export const attendance_tag_use_cases_provider = [
  {
    provide: AttendanceTagFindAllUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagFindAllUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  },
  {
    provide: AttendanceTagSearchUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagSearchUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  },
  {
    provide: AttendanceTagFindByIdUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagFindByIdUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  },
  {
    provide: AttendanceTagCreateUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagCreateUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  },
  {
    provide: AttendanceTagUpdateUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagUpdateUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  },
  {
    provide: AttendanceTagDeleteUseCase.name,
    useFactory: (repository: IAttendanceTagRepository) => new AttendanceTagDeleteUseCase(repository),
    inject: [IAttendanceTagRepository.name]
  }
];

export const attendance_tag_repositories_provider = [
  {
    provide: IAttendanceTagRepository.name,
    useClass: AttendanceTagMysqlRepository
  }
];
