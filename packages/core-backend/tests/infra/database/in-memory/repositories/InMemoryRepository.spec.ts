import { BaseDto, InMemoryRepository } from '../../../../../src';

interface StubDto extends BaseDto {
  id: number;
  name: string;
  address_number: number | null;
}

class StubInMemoryRepository extends InMemoryRepository<StubDto> {
  protected idField: string = 'id';
}

describe('InMemoryRepository Unit Test', () => {
  describe('findAll', () => {
    it('must return all entities', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const stubTwo: StubDto = {
        id: 2,
        name: 'Name 02',
        address_number: 10,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);
      await repository.create(stubTwo);
      const stubs = await repository.findAll();

      expect(stubs.length).toEqual(2);
      expect(stubs).toEqual([
        {
          id: 1,
          name: 'Name 01',
          address_number: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        },
        {
          id: 2,
          name: 'Name 02',
          address_number: 10,
          created_at: expect.any(Date),
          updated_at: expect.any(Date)
        }
      ]);
    });
  });

  describe('findById', () => {
    it('must return a valid entity by id', async () => {
      const stubDto: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: 15,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stubDto);

      const stubCreated = await repository.findById(stubDto.id);

      expect(stubCreated.id).toEqual(stubDto.id);
      expect(stubCreated).toEqual({
        id: 1,
        name: 'Name 01',
        address_number: 15,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must throw error when entity not found', async () => {
      const repository = new StubInMemoryRepository();

      await expect(async () => repository.findById(0)).rejects.toThrowError('Entidade não encontrada pelo id: 0');
    });
  });

  describe('create', () => {
    it('must create a new entity with required props', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);
      const stubCreated = await repository.findById(stub.id);

      expect(stubCreated.id).toEqual(stub.id);
      expect(stubCreated).toEqual({
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must create a new entity with all props', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: 150,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);
      const stubCreated = await repository.findById(stub.id);

      expect(stubCreated.id).toEqual(stub.id);
      expect(stubCreated).toEqual({
        id: 1,
        name: 'Name 01',
        address_number: 150,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });
  });

  describe('update', () => {
    it('must update a entity with required props', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);

      stub.name = 'Name Updated';

      await repository.update(stub);

      const stubUpdated = await repository.findById(stub.id);

      expect(stubUpdated.id).toEqual(stub.id);
      expect(stubUpdated).toEqual({
        id: 1,
        name: 'Name Updated',
        address_number: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must update a entity with all props', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);

      stub.name = 'Name Updated';
      stub.address_number = 1500;

      await repository.update(stub);

      const stubUpdated = await repository.findById(stub.id);

      expect(stubUpdated.id).toEqual(stub.id);
      expect(stubUpdated).toEqual({
        id: 1,
        name: 'Name Updated',
        address_number: 1500,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });
    });

    it('must throw error when try to delete a entity not exist', async () => {
      const repository = new StubInMemoryRepository();

      expect(async () => repository.delete(0)).rejects.toThrowError('Entidade não encontrada pelo id: 0');
    });
  });

  describe('delete', () => {
    it('must delete a entity', async () => {
      const stub: StubDto = {
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      const repository = new StubInMemoryRepository();

      await repository.create(stub);

      const stubCreated = await repository.findById(stub.id);

      expect(stubCreated.id).toEqual(stub.id);
      expect(stubCreated).toEqual({
        id: 1,
        name: 'Name 01',
        address_number: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      });

      await repository.delete(stub.id);

      const stubs = await repository.findAll();

      expect(stubs.length).toBe(0);
    });

    it('must throw error when try to delete a entity not exist', async () => {
      const repository = new StubInMemoryRepository();

      expect(async () => repository.delete(0)).rejects.toThrowError('Entidade não encontrada pelo id: 0');
    });
  });
});
