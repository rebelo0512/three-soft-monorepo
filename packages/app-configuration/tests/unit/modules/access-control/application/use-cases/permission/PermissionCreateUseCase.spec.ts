import {
  PermissionCreateInputDto,
  PermissionCreateUseCase,
  PermissionInMemoryRepository,
  IPermissionRepository,
  PermissionDomainInMemoryRepository,
  IPermissionDomainRepository
} from '../../../../../../../src';
import { createPermissionDomain } from '../../../../../../helpers';

describe('PermissionCreateUseCase Unit Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let permissionRepository: IPermissionRepository;
  let permissionCreateUseCase: PermissionCreateUseCase;

  beforeEach(() => {
    permissionDomainRepository = new PermissionDomainInMemoryRepository();
    permissionRepository = new PermissionInMemoryRepository();
    permissionCreateUseCase = new PermissionCreateUseCase(permissionRepository, permissionDomainRepository);
  });

  it('should create a new permission', async () => {
    const permission_domain = await createPermissionDomain(permissionDomainRepository, 1);

    const input: PermissionCreateInputDto = {
      system_name: permission_domain.perm_system_name,
      domain: permission_domain.perm_dom_name,
      name: 'Permission One',
      sub_domain: null
    };

    const permissionCreated = await permissionCreateUseCase.execute(input);

    expect(permissionCreated).toEqual({
      perm_id: 1,
      perm_name: 'Permission One',
      perm_sub_dom_name: null,
      created_at: expect.any(Date),
      updated_at: expect.any(Date),
      perm_dom_id: 1,
      perm_dom_name: permission_domain.perm_dom_name,
      perm_system_name: permission_domain.perm_system_name
    });
  });

  it('should throw error when system_name is invalid', async () => {
    const arrayToThrow = [
      {
        value: [],
        message: 'Error: system_name must be a `string` type, but the final value was: `[]`.'
      },
      {
        value: null,
        message: ''
      },
      {
        value: undefined,
        message: ''
      }
    ];

    const promises = arrayToThrow.map(async ({ value, message }) => {
      await expect(async () =>
        permissionCreateUseCase.execute({
          name: 'Name',
          sub_domain: null,
          system_name: value as never,
          domain: 'Domain'
        })
      ).rejects.toThrowError(message);
    });

    await Promise.all(promises);
  });

  it('should throw error when domain is invalid', async () => {
    const arrayToThrow = [
      {
        value: [],
        message: 'Error: domain must be a `string` type, but the final value was: `[]`.'
      },
      {
        value: null,
        message: ''
      },
      {
        value: undefined,
        message: ''
      }
    ];

    const promises = arrayToThrow.map(async ({ value, message }) => {
      await expect(async () =>
        permissionCreateUseCase.execute({
          name: 'Name',
          sub_domain: null,
          system_name: 'System',
          domain: value as never
        })
      ).rejects.toThrowError(message);
    });

    await Promise.all(promises);
  });

  it('should throw error when name is invalid', async () => {
    const arrayToThrow = [
      {
        value: [],
        message: 'Error: name must be a `string` type, but the final value was: `[]`.'
      },
      {
        value: null,
        message: ''
      },
      {
        value: undefined,
        message: ''
      }
    ];

    const promises = arrayToThrow.map(async ({ value, message }) => {
      await expect(async () =>
        permissionCreateUseCase.execute({
          name: value as never,
          sub_domain: null,
          system_name: 'System',
          domain: 'Domain'
        })
      ).rejects.toThrowError(message);
    });

    await Promise.all(promises);
  });

  it('should throw error when sub_domain is invalid', async () => {
    const arrayToThrow = [
      {
        value: [],
        message: 'Error: sub_domain must be a `string` type, but the final value was: `[]`.'
      }
    ];

    const promises = arrayToThrow.map(async ({ value, message }) => {
      await expect(async () =>
        permissionCreateUseCase.execute({
          name: 'Name',
          sub_domain: value as never,
          system_name: 'System',
          domain: 'Domain'
        })
      ).rejects.toThrowError(message);
    });

    await Promise.all(promises);
  });
});
