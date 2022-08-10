import Redis from 'ioredis';
import { ICacheBaseRepository } from '../../../../domain';

/* c8 ignore start */
export class RedisBaseRepository implements ICacheBaseRepository {
  key = '';

  constructor(protected readonly connection: Redis | null) {}

  async getCache(): Promise<string | null> {
    const is_connected = await this.validateConnection();

    if (!is_connected) return null;

    return this.connection?.get(this.key) ?? null;
  }

  setKey(key: string): void {
    this.key = key;
  }

  async setCache(values: string, time: number): Promise<void> {
    const is_connected = await this.validateConnection();

    if (!is_connected) return;

    await this.connection?.setex(this.key, time, values);
  }

  async deleteCache(): Promise<void> {
    const is_connected = await this.validateConnection();

    if (!is_connected) return;

    await this.connection?.del(this.key);
  }

  getConnection() {
    return this.connection;
  }

  protected async validateConnection(): Promise<boolean> {
    try {
      const is_connected = await this.connection?.info();

      if (is_connected) return true;

      const try_connection = await this.connection?.reset();

      return try_connection === 'OK';
    } catch {
      return false;
    }
  }
  /* c8 ignore stop */
}
