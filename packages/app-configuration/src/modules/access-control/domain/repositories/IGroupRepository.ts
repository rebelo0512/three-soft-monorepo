import { IBaseRepository } from '@three-soft/core-backend';
import { GroupDto } from '../dtos';

export abstract class IGroupRepository extends IBaseRepository {
  abstract findAll(): Promise<GroupDto[]>;
  abstract search(name: string | null | undefined): Promise<GroupDto[]>;
  abstract findById(id: number): Promise<GroupDto | null>;
  abstract findByName(name: string): Promise<GroupDto | null>;
  abstract create(name: string): Promise<GroupDto>;
  abstract delete(id: number): Promise<void>;
}
