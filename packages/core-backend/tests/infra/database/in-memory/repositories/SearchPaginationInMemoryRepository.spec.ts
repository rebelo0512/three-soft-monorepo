import { SearchPaginationInMemoryRepository, SearchPaginationParamsDefault, BaseDto } from '../../../../../src';

interface StubDto extends BaseDto {
  id: number;
  name: string;
}

class StubSearchRepository extends SearchPaginationInMemoryRepository<StubDto> {
  sortableFields: (keyof StubDto)[] = ['id', 'name'];

  protected async applyFilter(items: StubDto[], filter: string | null): Promise<StubDto[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) => item.name.includes(filter));
  }
}

async function createStubs(repository: StubSearchRepository, total: number) {
  for (let index = 0; index < total; index++) {
    await repository.create({
      id: index + 1,
      name: `Name ${String(index + 1).padStart(2, '0')}`,
      created_at: new Date(),
      updated_at: new Date()
    });
  }
}

describe('SearchPaginationInMemoryRepository Unit Tests', () => {
  describe('search', () => {
    it('must filter by word "1" and return 5 stubs from 13 based on name and with sort direction to asc', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 13);

      const searchProps = new SearchPaginationParamsDefault({
        page: 1,
        itemsPerPage: 10,
        filter: '1'
      });

      const stubs = await repository.search(searchProps);

      expect(stubs.currentPage).toBe(1);
      expect(stubs.totalItems).toBe(5);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 10',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 12',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 13',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must filter by word "0" and return 10 stubs from 13 based on name and with sort direction to desc', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 13);

      const searchProps = new SearchPaginationParamsDefault({
        page: 1,
        itemsPerPage: 10,
        filter: '0',
        sort: 'name',
        sortDirection: 'desc'
      });

      const stubs = await repository.search(searchProps);

      expect(stubs.currentPage).toBe(1);
      expect(stubs.totalItems).toBe(10);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 10',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 09',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 08',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 07',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 06',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 05',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 04',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return 10 stubs from 13 and sortable by name with desc direction', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 13);

      const props = new SearchPaginationParamsDefault({
        page: 1,
        itemsPerPage: 10,
        sort: 'name',
        sortDirection: 'desc'
      });

      const stubs = await repository.search(props);

      expect(stubs.currentPage).toBe(1);
      expect(stubs.totalItems).toBe(13);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 13',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 12',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 10',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 09',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 08',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 07',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 06',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 05',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 04',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return 3 last stubs from 13, in page 2 and sortable by name with asc direction', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 13);

      const props = new SearchPaginationParamsDefault({
        page: 2,
        itemsPerPage: 10,
        sort: 'name',
        sortDirection: 'asc'
      });

      const stubs = await repository.search(props);

      expect(stubs.currentPage).toBe(2);
      expect(stubs.totalItems).toBe(13);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 11',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 12',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 13',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return 3 last stubs from 13, in page 2 and sortable by name with desc direction', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 13);

      const props = new SearchPaginationParamsDefault({
        page: 2,
        itemsPerPage: 10,
        sort: 'name',
        sortDirection: 'desc'
      });

      const stubs = await repository.search(props);

      expect(stubs.currentPage).toBe(2);
      expect(stubs.totalItems).toBe(13);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });

    it('must return 3 stubs sortable by name with desc direction', async () => {
      const repository = new StubSearchRepository();

      await createStubs(repository, 3);

      const props = new SearchPaginationParamsDefault({
        page: 1,
        itemsPerPage: 10,
        sort: 'name',
        sortDirection: 'desc'
      });

      const stubs = await repository.search(props);

      expect(stubs.currentPage).toBe(1);
      expect(stubs.totalItems).toBe(3);
      expect(stubs.items).toEqual([
        {
          id: expect.any(Number),
          name: 'Name 03',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 02',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: expect.any(Number),
          name: 'Name 01',
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });
});
