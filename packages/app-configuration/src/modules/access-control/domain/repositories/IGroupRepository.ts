import { GroupDto } from '../dtos';

export abstract class IGroupRepository {
  abstract tableName: string;

  abstract findAll(): Promise<GroupDto[]>;
  abstract search(name: string): Promise<GroupDto[]>;
  abstract findById(id: number): Promise<GroupDto>;
  abstract findByName(name: string): Promise<GroupDto>;
  abstract create(name: string): Promise<GroupDto>;
  abstract delete(id: number): Promise<void>;
}
