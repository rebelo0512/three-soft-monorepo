import { DatabaseRedisConnection, RedisBaseRepository } from '../../../../../../src';

describe('RedisBaseRepository Integration Tests', () => {
  const connection = DatabaseRedisConnection();
  const redisBaseRepository = new RedisBaseRepository(connection);

  beforeAll(() => {
    redisBaseRepository.setKey('TEST_CACHE_KEY');
  });

  afterAll(async () => {
    connection?.disconnect();
  });

  it('should set the cache by key, return and delete', async () => {
    await redisBaseRepository.setCache('Test Cache', 60 * 60);

    const key = await redisBaseRepository.getCache();

    expect(key).toBe('Test Cache');

    await redisBaseRepository.deleteCache();

    const key_deleted = await redisBaseRepository.getCache();

    expect(key_deleted).toBeNull();
  });
});
