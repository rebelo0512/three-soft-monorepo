import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  cleanAttendanceHourDB,
  createAttendanceHour,
  createAttendanceHours,
  IAttendanceHourRepository
} from '@three-soft/pkg-configuration';
import { AttendanceHourController } from '../../../../../../../../../src/modules';
import { createAttendanceHourModule } from '../../../../../../../../helpers';

describe('AttendanceHourController Integration Tests', () => {
  let controller: AttendanceHourController;
  let repository: IAttendanceHourRepository;

  beforeAll(async () => {
    const moduleRef = await createAttendanceHourModule();

    repository = moduleRef.get<IAttendanceHourRepository>(IAttendanceHourRepository.name);
    controller = moduleRef.get<AttendanceHourController>(AttendanceHourController);
  });

  beforeEach(async () => {
    await cleanAttendanceHourDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('must return a array of hours', async () => {
      await createAttendanceHours(repository, 3);

      const hours = await controller.findAll();

      expect(hours.length).toBe(3);
      expect(hours).toEqual([
        {
          att_hour_id: expect.any(Number),
          att_hour_name: 'Name 01',
          att_hour_status: 1,
          att_hour_monday: 1,
          att_hour_tuesday: 0,
          att_hour_wednesday: 1,
          att_hour_thursday: 0,
          att_hour_friday: 0,
          att_hour_saturday: 1,
          att_hour_sunday: 0,
          att_hour_message: 'Message 01',
          att_hour_start: '09:00',
          att_hour_end: '12:00',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_hour_id: expect.any(Number),
          att_hour_name: 'Name 02',
          att_hour_status: 1,
          att_hour_monday: 1,
          att_hour_tuesday: 0,
          att_hour_wednesday: 1,
          att_hour_thursday: 0,
          att_hour_friday: 0,
          att_hour_saturday: 1,
          att_hour_sunday: 0,
          att_hour_message: 'Message 02',
          att_hour_start: '09:00',
          att_hour_end: '12:00',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_hour_id: expect.any(Number),
          att_hour_name: 'Name 03',
          att_hour_status: 1,
          att_hour_monday: 1,
          att_hour_tuesday: 0,
          att_hour_wednesday: 1,
          att_hour_thursday: 0,
          att_hour_friday: 0,
          att_hour_saturday: 1,
          att_hour_sunday: 0,
          att_hour_message: 'Message 03',
          att_hour_start: '09:00',
          att_hour_end: '12:00',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findById', () => {
    it('should return hour by id', async () => {
      const hour = await createAttendanceHour(repository);

      const hour_created = await controller.findById(hour.att_hour_id);

      expect(hour_created).toEqual(hour);
    });

    it('should throw error if hour is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError(
        'Horário de Atendimento não encontrada pelo(a) id: 0'
      );
    });
  });

  describe('create', () => {
    it('should create a hour', async () => {
      const hour_created = await controller.create({
        name: 'Name 09',
        status: true,
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: false,
        message: 'Message 09',
        start: '09:00',
        end: '12:00'
      });

      expect(hour_created.att_hour).toEqual({
        att_hour_id: expect.any(Number),
        att_hour_name: 'Name 09',
        att_hour_status: 1,
        att_hour_monday: 1,
        att_hour_tuesday: 0,
        att_hour_wednesday: 1,
        att_hour_thursday: 0,
        att_hour_friday: 0,
        att_hour_saturday: 1,
        att_hour_sunday: 0,
        att_hour_message: 'Message 09',
        att_hour_start: '09:00',
        att_hour_end: '12:00',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a hour', async () => {
      const hour_created = await createAttendanceHour(repository);

      const hour_updated = await controller.update(hour_created.att_hour_id, {
        id: hour_created.att_hour_id,
        name: 'Name Updated',
        status: true,
        monday: true,
        tuesday: false,
        wednesday: true,
        thursday: false,
        friday: false,
        saturday: true,
        sunday: false,
        message: 'Message Updated',
        start: '09:00',
        end: '12:00'
      });

      expect(hour_updated.att_hour).toEqual({
        att_hour_id: expect.any(Number),
        att_hour_name: 'Name Updated',
        att_hour_status: 1,
        att_hour_monday: 1,
        att_hour_tuesday: 0,
        att_hour_wednesday: 1,
        att_hour_thursday: 0,
        att_hour_friday: 0,
        att_hour_saturday: 1,
        att_hour_sunday: 0,
        att_hour_message: 'Message Updated',
        att_hour_start: '09:00',
        att_hour_end: '12:00',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should throw error if hour is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError(
        'Horário de Atendimento não encontrada pelo(a) id: 0'
      );
    });
  });

  describe('delete', () => {
    it('should delete a hour', async () => {
      const hour = await createAttendanceHour(repository);

      const hour_created = await repository.findById(hour.att_hour_id);

      expect(hour_created).toEqual(hour);

      await controller.delete(hour.att_hour_id);

      const hour_deleted = await repository.findById(hour.att_hour_id);

      expect(hour_deleted).toBeNull();
    });

    it('should throw error if hour is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError(
        'Horário de Atendimento não encontrada pelo(a) id: 0'
      );
    });
  });
});
