import { GroupInMemoryRepository, GroupRepositorySearchParams } from '../../../../../../../../src';
import { createGroups } from '../../../../../../../helpers';

describe('GroupInMemoryRepository Unit Tests', () => {
  describe('search', () => {
    it('must filter 7 groups from 15 by prop name with word "1" and sorted by created_at with direction asc', async () => {
      const repository = new GroupInMemoryRepository();

      await createGroups(repository, 15);

      const searchProps = new GroupRepositorySearchParams({
        page: 1,
        itemsPerPage: 10,
        filter: '1',
        sort: 'created_at',
        sortDirection: 'asc'
      });

      const groups = await repository.search(searchProps);

      expect(groups.totalItems).toBe(7);
      expect(groups.currentPage).toBe(1);
      expect(groups.items).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 10',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 12',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 13',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 14',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 15',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must filter 1 group from 15 by prop name "Name 01"', async () => {
      const repository = new GroupInMemoryRepository();

      await createGroups(repository, 15);

      const searchProps = new GroupRepositorySearchParams({
        page: 1,
        itemsPerPage: 10,
        filter: 'Name 01'
      });

      const categories = await repository.search(searchProps);

      expect(categories.totalItems).toBe(1);
      expect(categories.currentPage).toBe(1);
      expect(categories.items).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return 5 groups from 15 by prop page 2 and sorted by name with direction asc', async () => {
      const repository = new GroupInMemoryRepository();

      await createGroups(repository, 15);

      const searchProps = new GroupRepositorySearchParams({
        page: 2,
        itemsPerPage: 10,
        filter: null,
        sort: 'name',
        sortDirection: 'asc'
      });

      const groups = await repository.search(searchProps);

      expect(groups.totalItems).toBe(15);
      expect(groups.currentPage).toBe(2);
      expect(groups.items).toEqual([
        {
          group_id: expect.any(Number),
          group_name: 'Name 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 12',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 13',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 14',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          group_id: expect.any(Number),
          group_name: 'Name 15',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });
});
