/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchPaginationParamsDefault } from '../../../../../src';

describe('SearchPaginationParamsDefault Unit Test', () => {
  it('must test all getters', () => {
    const searchParams = new SearchPaginationParamsDefault({
      filter: 'id',
      itemsPerPage: 100,
      page: 10,
      sort: 'createdBy',
      sortDirection: 'asc'
    });

    expect(searchParams.filter).toBe('id');
    expect(searchParams.itemsPerPage).toBe(100);
    expect(searchParams.page).toBe(10);
    expect(searchParams.sort).toBe('createdBy');
    expect(searchParams.sortDirection).toBe('asc');
    expect(searchParams.offset).toBe(900);
  });

  it('must create a new entity with no props provided', () => {
    const searchParams = new SearchPaginationParamsDefault();

    expect(searchParams).toEqual({
      page: 1,
      itemsPerPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
      offset: 0
    });
  });

  it('must create a new entity with all props', () => {
    const searchParams = new SearchPaginationParamsDefault({
      page: 2,
      itemsPerPage: 25,
      filter: 'name',
      sort: 'updatedBy',
      sortDirection: 'desc'
    });

    expect(searchParams).toEqual({
      page: 2,
      itemsPerPage: 25,
      sort: 'updatedBy',
      sortDirection: 'desc',
      filter: 'name',
      offset: 25
    });
  });

  it('must create a new entity with not nullable props', () => {
    const searchParams = new SearchPaginationParamsDefault({
      page: 2,
      itemsPerPage: 25
    });

    expect(searchParams).toEqual({
      page: 2,
      itemsPerPage: 25,
      sort: null,
      sortDirection: null,
      filter: null,
      offset: 25
    });
  });

  it('must create a new entity with only nullable props', () => {
    const searchParams = new SearchPaginationParamsDefault({
      filter: 'id',
      sort: 'createdBy',
      sortDirection: 'asc'
    });

    expect(searchParams).toEqual({
      page: 1,
      itemsPerPage: 10,
      filter: 'id',
      sort: 'createdBy',
      sortDirection: 'asc',
      offset: 0
    });
  });

  it('must return page 1 if page provided is NaN or less than 0', () => {
    const searchParams = new SearchPaginationParamsDefault({
      page: 'a' as any
    });

    expect(searchParams.page).toBe(1);

    const searchParamsTwo = new SearchPaginationParamsDefault({
      page: -1
    });

    expect(searchParamsTwo.page).toBe(1);
  });

  it('must return itemsPerPage 10 if itemsPerPage provided is NaN or less than 0', () => {
    const searchParams = new SearchPaginationParamsDefault({
      itemsPerPage: 'a' as any
    });

    expect(searchParams.itemsPerPage).toBe(10);

    const searchParamsTwo = new SearchPaginationParamsDefault({
      itemsPerPage: -1
    });

    expect(searchParamsTwo.itemsPerPage).toBe(10);
  });

  it('must return sort null if sort provided is undefined or string empty', () => {
    const searchParams = new SearchPaginationParamsDefault({
      sort: ''
    });

    expect(searchParams.sort).toBeNull();

    const searchParamsTwo = new SearchPaginationParamsDefault({
      sort: undefined
    });

    expect(searchParamsTwo.sort).toBeNull();
  });

  it('must return sortDirection null if no sort is provided', () => {
    const searchParams = new SearchPaginationParamsDefault({
      sort: '',
      sortDirection: 'asc'
    });

    expect(searchParams.sortDirection).toBeNull();
  });

  it('must return sortDirection asc if sortDirection provided is diff of asc or desc', () => {
    const searchParams = new SearchPaginationParamsDefault({
      sort: 'id',
      sortDirection: 'different' as any
    });

    expect(searchParams.sortDirection).toBe('asc');
  });

  it('must return filter null if filter provided is undefined or string empty', () => {
    const searchParams = new SearchPaginationParamsDefault({
      filter: ''
    });

    expect(searchParams.filter).toBeNull();

    const searchParamsTwo = new SearchPaginationParamsDefault({
      filter: undefined
    });

    expect(searchParamsTwo.filter).toBeNull();
  });

  it('must calculate offset', () => {
    const searchParams = new SearchPaginationParamsDefault({
      itemsPerPage: 10,
      page: 2
    });

    expect(searchParams).toEqual({
      page: 2,
      itemsPerPage: 10,
      sort: null,
      sortDirection: null,
      filter: null,
      offset: 10
    });
  });
});
