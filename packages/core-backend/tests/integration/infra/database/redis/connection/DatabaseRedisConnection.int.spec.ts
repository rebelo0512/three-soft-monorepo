import { DatabaseRedisConnection } from '../../../../../../src';

describe('DatabaseRedisConnection Integration Tests', () => {
  const connection = DatabaseRedisConnection();

  afterAll(async () => {
    connection?.disconnect();
  });

  it('must return redis connection if env REDIS_POWER is ON', async () => {
    process.env.REDIS_POWER = 'ON';

    const ping = await connection?.ping();

    expect(ping).toBe('PONG');
  });
});
