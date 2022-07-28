import { OmitBaseDto } from '@three-soft/core-backend';
import {
  IPermissionDomainRepository,
  IPermissionRepository,
  PermissionDomainDto,
  PermissionDomainInMemoryRepository,
  PermissionFindAllByDomainNameUseCase,
  PermissionInMemoryRepository
} from '../../../../../../../src';
import { createPermission, createPermissionDomain } from '../../../../../../helpers';

describe('PermissionFindAllByDomainNameUseCase Unit Tests', () => {
  let permissionDomainRepository: IPermissionDomainRepository;
  let permissionRepository: IPermissionRepository;
  let permissionFindAllUseCase: PermissionFindAllByDomainNameUseCase;

  beforeEach(() => {
    permissionDomainRepository = new PermissionDomainInMemoryRepository();
    permissionRepository = new PermissionInMemoryRepository();
    permissionFindAllUseCase = new PermissionFindAllByDomainNameUseCase(
      permissionRepository,
      permissionDomainRepository
    );
  });

  it('should return all permissions', async () => {
    const permission_domain_entity = await createPermissionDomain(permissionDomainRepository, 1);

    const permission_domain: OmitBaseDto<PermissionDomainDto> = {
      perm_dom_id: permission_domain_entity.perm_dom_id,
      perm_dom_name: permission_domain_entity.perm_dom_name,
      perm_system_name: permission_domain_entity.perm_system_name
    };

    await createPermission(permissionRepository, 1, {
      perm_id: 1,
      perm_name: 'Permission 01',
      perm_sub_dom_name: 'Sub Domain Name',
      created_at: new Date(),
      updated_at: new Date(),
      ...permission_domain
    });
    await createPermission(permissionRepository, 2, {
      perm_id: 2,
      perm_name: 'Permission 02',
      perm_sub_dom_name: 'Sub Domain Name',
      created_at: new Date(),
      updated_at: new Date(),
      ...permission_domain
    });
    await createPermission(permissionRepository, 3, {
      perm_id: 3,
      perm_name: 'Permission 03',
      perm_sub_dom_name: 'Sub Domain Name 2',
      created_at: new Date(),
      updated_at: new Date(),
      ...permission_domain
    });

    const result = await permissionFindAllUseCase.execute({
      system_name: permission_domain.perm_system_name,
      domain_name: permission_domain.perm_dom_name
    });

    expect(result.permissions.length).toEqual(3);
    expect(result.sub_dom.length).toEqual(2);
    expect(result).toEqual({
      permissions: [
        {
          perm_id: 1,
          perm_name: 'Permission 01',
          perm_sub_dom_name: 'Sub Domain Name',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain_entity.perm_dom_id,
          perm_dom_name: permission_domain_entity.perm_dom_name,
          perm_system_name: permission_domain_entity.perm_system_name
        },
        {
          perm_id: 2,
          perm_name: 'Permission 02',
          perm_sub_dom_name: 'Sub Domain Name',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain_entity.perm_dom_id,
          perm_dom_name: permission_domain_entity.perm_dom_name,
          perm_system_name: permission_domain_entity.perm_system_name
        },
        {
          perm_id: 3,
          perm_name: 'Permission 03',
          perm_sub_dom_name: 'Sub Domain Name 2',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain_entity.perm_dom_id,
          perm_dom_name: permission_domain_entity.perm_dom_name,
          perm_system_name: permission_domain_entity.perm_system_name
        }
      ],
      sub_dom: [
        {
          perm_id: 1,
          perm_name: 'Permission 01',
          perm_sub_dom_name: 'Sub Domain Name',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain_entity.perm_dom_id,
          perm_dom_name: permission_domain_entity.perm_dom_name,
          perm_system_name: permission_domain_entity.perm_system_name
        },

        {
          perm_id: 3,
          perm_name: 'Permission 03',
          perm_sub_dom_name: 'Sub Domain Name 2',
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
          perm_dom_id: permission_domain_entity.perm_dom_id,
          perm_dom_name: permission_domain_entity.perm_dom_name,
          perm_system_name: permission_domain_entity.perm_system_name
        }
      ]
    });
  });

  it('should return array empty if no permissions created', async () => {
    const permission_domain_entity = await createPermissionDomain(permissionDomainRepository, 1);

    const permissions = await permissionFindAllUseCase.execute({
      system_name: permission_domain_entity.perm_system_name,
      domain_name: permission_domain_entity.perm_dom_name
    });

    expect(permissions).toEqual({
      permissions: [],
      sub_dom: []
    });
  });

  it('should throw error when permission domain not found', async () => {
    await expect(async () =>
      permissionFindAllUseCase.execute({ system_name: 'throw error', domain_name: 'throw error' })
    ).rejects.toThrowError('Entidade não encontrada pelo(a) nome: throw error');
  });
});
