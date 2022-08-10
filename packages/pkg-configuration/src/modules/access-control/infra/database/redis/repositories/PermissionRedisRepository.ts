import { DatabaseRedisConnection, RedisBaseRepository } from '@three-soft/core-backend';
import { IPermissionCacheRepository } from '../../../../domain/interfaces/repositories/IPermissionCacheRepository';

export class PermissionRedisRepository extends RedisBaseRepository implements IPermissionCacheRepository {
  key = '';

  constructor() {
    super(DatabaseRedisConnection());
  }
}
