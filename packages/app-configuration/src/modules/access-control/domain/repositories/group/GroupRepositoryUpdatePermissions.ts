import { PermissionDto } from '../../dtos';

export type GroupRepositoryUpdatePermissionsInput = {
  group_id: number;
  permissions_to_add: PermissionDto[];
  permissions_to_delete: PermissionDto[];
};
