import { ICacheBaseRepository } from '@three-soft/core-backend';

/* c8 ignore start */
export abstract class IPermissionCacheRepository implements ICacheBaseRepository {
  key = '';

  abstract getCache(): Promise<string | null>;
  abstract setKey(key: string): void;
  abstract setCache(values: string, time: number): Promise<void>;
  abstract deleteCache(): Promise<void>;
}
/* c8 ignore stop */
