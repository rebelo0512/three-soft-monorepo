import { BaseDto, SearchPaginationResponseDefault } from '../../../../../src';

interface StubDto extends BaseDto {
  id: number;
  name: string;
}

const stubDto: StubDto = { id: 1, name: 'Name 01', created_at: new Date(), updated_at: new Date() };
const stubTwoDto: StubDto = { id: 2, name: 'Name 02', created_at: new Date(), updated_at: new Date() };

describe('SearchPaginationResponseDefault Unit Tests', () => {
  it('must create a new entity with required props', () => {
    const searchResult = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 10,
      totalItems: 20
    });

    expect(searchResult).toEqual({
      items: [stubDto, stubTwoDto],
      totalItems: 20,
      currentPage: 1,
      itemsPerPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
      totalPages: 2
    });
  });

  it('must create a new entity with all props', () => {
    const searchResult = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 10,
      totalItems: 20,
      filter: 'id',
      sort: 'created_at',
      sortDirection: 'asc'
    });

    expect(searchResult).toEqual({
      items: [stubDto, stubTwoDto],
      totalItems: 20,
      currentPage: 1,
      itemsPerPage: 10,
      filter: 'id',
      sort: 'created_at',
      sortDirection: 'asc',
      totalPages: 2
    });
  });

  it('must calculate total pages', () => {
    const searchResult = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 10,
      totalItems: 11
    });

    expect(searchResult.totalPages).toBe(2);

    const searchResultTwo = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 25,
      totalItems: 11
    });

    expect(searchResultTwo.totalPages).toBe(1);

    const searchResultThree = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 25,
      totalItems: 95
    });

    expect(searchResultThree.totalPages).toBe(4);
  });

  it('must return with get dto method', () => {
    const searchResult = new SearchPaginationResponseDefault<StubDto>({
      currentPage: 1,
      items: [stubDto, stubTwoDto],
      itemsPerPage: 10,
      totalItems: 20
    });

    expect(searchResult.getDto()).toEqual({
      items: [stubDto, stubTwoDto],
      totalItems: 20,
      currentPage: 1,
      itemsPerPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
      totalPages: 2
    });
  });
});
