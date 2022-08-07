import { IBaseRepository } from '@three-soft/core-backend';
import { UserDto } from '../../dtos';
import {
  UserRepositoryCreateInput,
  UserRepositoryFindByEmailOrNameInput,
  UserRepositorySearchInput,
  UserRepositoryUpdateInput,
  UserRepositoryUpdateLastTokenInput,
  UserRepositoryUpdatePasswordInput
} from './user-repository';

/* c8 ignore start */
export abstract class IUserRepository extends IBaseRepository {
  abstract findAll(): Promise<UserDto[]>;
  abstract search(input: UserRepositorySearchInput): Promise<UserDto[]>;
  abstract findById(id: number): Promise<UserDto | null>;
  abstract findByEmailOrName(input: UserRepositoryFindByEmailOrNameInput): Promise<UserDto | null>;
  abstract findByGroupId(group_id: number): Promise<UserDto | null>;
  abstract create(input: UserRepositoryCreateInput): Promise<UserDto>;
  abstract update(input: UserRepositoryUpdateInput): Promise<UserDto>;
  abstract updatePassword(input: UserRepositoryUpdatePasswordInput): Promise<UserDto>;
  abstract updateLastToken(input: UserRepositoryUpdateLastTokenInput): Promise<UserDto>;
}
/* c8 ignore stop */
