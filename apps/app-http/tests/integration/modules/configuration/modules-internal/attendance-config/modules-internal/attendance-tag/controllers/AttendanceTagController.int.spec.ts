import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import {
  cleanAttendanceTagDB,
  createAttendanceTag,
  createAttendanceTags,
  IAttendanceTagRepository
} from '@three-soft/pkg-configuration';
import { AttendanceTagController } from '../../../../../../../../../src/modules';
import { createAttendanceTagModule } from '../../../../../../../../helpers';

describe('AttendanceTagController Integration Tests', () => {
  let controller: AttendanceTagController;
  let repository: IAttendanceTagRepository;

  beforeAll(async () => {
    const moduleRef = await createAttendanceTagModule();

    repository = moduleRef.get<IAttendanceTagRepository>(IAttendanceTagRepository.name);
    controller = moduleRef.get<AttendanceTagController>(AttendanceTagController);
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('must return a array of city', async () => {
      await createAttendanceTags(repository, 3);

      const tags = await controller.findAll();

      expect(tags.length).toBe(3);
      expect(tags).toEqual([
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Name 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Name 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('search', () => {
    it('should return all tags filtered by name', async () => {
      await createAttendanceTag(repository, 'Tag 01');
      await createAttendanceTag(repository, 'Tag 02');
      await createAttendanceTag(repository, 'Tag 11');

      const tags = await controller.search('Tag 0');

      expect(tags.length).toBe(2);
      expect(tags).toEqual([
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);

      const tags_two = await controller.search('Tag 11');

      expect(tags_two.length).toBe(1);
      expect(tags_two).toEqual([
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('should return all tags if no name is provided', async () => {
      await createAttendanceTag(repository, 'Tag 01');
      await createAttendanceTag(repository, 'Tag 02');
      await createAttendanceTag(repository, 'Tag 11');

      const tags = await controller.search(null);

      expect(tags.length).toBe(3);
      expect(tags).toEqual([
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          att_tag_id: expect.any(Number),
          att_tag_name: 'Tag 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findById', () => {
    it('should return tag by id', async () => {
      const tag = await createAttendanceTag(repository);

      const tag_created = await controller.findById(tag.att_tag_id);

      expect(tag_created).toEqual(tag);
    });

    it('should throw error if tag is not found', async () => {
      await expect(() => controller.findById(0)).rejects.toThrowError('Tag não encontrada pelo(a) id: 0');
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const tag_created = await controller.create({ name: 'Tag 01' });

      expect(tag_created.tag).toEqual({
        att_tag_id: expect.any(Number),
        att_tag_name: 'Tag 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tag = await createAttendanceTag(repository);

      const tag_updated = await controller.update(tag.att_tag_id, {
        id: tag.att_tag_id,
        name: 'AttendanceTag Updated'
      });

      expect(tag_updated.tag).toEqual({
        att_tag_id: tag.att_tag_id,
        att_tag_name: 'AttendanceTag Updated',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('should throw error if tag is not found', async () => {
      const id_error = Math.random() * 10;

      await expect(() =>
        controller.update(id_error, {
          id: id_error,
          name: 'Test'
        })
      ).rejects.toThrowError(`Tag não encontrada pelo(a) id: ${id_error}`);
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      const tag = await repository.create('Tag 01');

      const tag_created = await repository.findById(tag.att_tag_id);

      expect(tag_created).toEqual(tag);

      await controller.delete(tag.att_tag_id);

      const tag_deleted = await repository.findById(tag.att_tag_id);

      expect(tag_deleted).toBeNull();
    });

    it('should throw error if tag is not found', async () => {
      await expect(() => controller.delete(0)).rejects.toThrowError('Tag não encontrada pelo(a) id: 0');
    });
  });
});
