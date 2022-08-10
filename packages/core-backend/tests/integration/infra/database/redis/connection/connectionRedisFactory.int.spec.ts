import Redis from 'ioredis';
import { connectionRedisFactory, DatabaseRedisConnection } from '../../../../../../src';

describe('connectionRedisFactory Integration Tests', () => {
  afterAll(async () => {
    DatabaseRedisConnection()?.disconnect();
  });

  it('must return redis connection if env REDIS_POWER is ON', () => {
    process.env.REDIS_POWER = 'ON';

    const connection = connectionRedisFactory(String(process.env.REDIS_STRING));

    expect(connection).toBeInstanceOf(Redis);

    connection?.disconnect();
  });

  it('must return null if env REDIS_POWER is OFF', () => {
    process.env.REDIS_POWER = 'OFF';

    const connection = connectionRedisFactory(String(process.env.REDIS_STRING));

    expect(connection).toBeNull();
  });
});
