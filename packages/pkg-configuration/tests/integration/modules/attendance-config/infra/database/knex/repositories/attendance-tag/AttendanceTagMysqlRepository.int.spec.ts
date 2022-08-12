import { DatabaseMysqlConnection } from '@three-soft/core-backend';
import { AttendanceTagMysqlRepository, IAttendanceTagRepository } from '../../../../../../../../../src';
import { cleanAttendanceTagDB, createAttendanceTag, createAttendanceTags } from '../../../../../../../../helpers';

describe('AttendanceTagMysqlRepository Integration Tests', () => {
  let repository: IAttendanceTagRepository;

  beforeAll(async () => {
    repository = new AttendanceTagMysqlRepository();
  });

  beforeEach(async () => {
    await cleanAttendanceTagDB(DatabaseMysqlConnection);
  });

  afterAll(async () => {
    await DatabaseMysqlConnection.destroy();
  });

  describe('findAll', () => {
    it('should return all tags', async () => {
      await createAttendanceTags(repository, 3);

      const tags = await repository.findAll();

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

      const tags = await repository.search('Tag 0');

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

      const tags_two = await repository.search('Tag 11');

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

      const tags = await repository.search(null);

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

      const tag_created = await repository.findById(tag.att_tag_id);

      expect(tag_created).toEqual(tag);
    });

    it('should return null if id tag not exist', async () => {
      const tag = await repository.findById(0);

      expect(tag).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const tag_created = await repository.create('Name 01');

      expect(tag_created).toEqual({
        att_tag_id: expect.any(Number),
        att_tag_name: 'Name 01',
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tag = await createAttendanceTag(repository);

      const tag_updated = await repository.update({ id: tag.att_tag_id, name: 'Name Updated' });

      expect(tag_updated).toEqual({
        att_tag_id: tag.att_tag_id,
        att_tag_name: 'Name Updated',
        created_at: tag.created_at,
        updated_at: expect.any(Date)
      });
    });
  });

  describe('delete', () => {
    it('should delete a tag', async () => {
      const tag = await repository.create('Queue 01');

      const tag_created = await repository.findById(tag.att_tag_id);

      expect(tag_created).toEqual(tag);

      await repository.delete(tag.att_tag_id);

      const tag_deleted = await repository.findById(tag.att_tag_id);

      expect(tag_deleted).toBeNull();
    });
  });
});
