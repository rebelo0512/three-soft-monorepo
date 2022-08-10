import Redis from 'ioredis';

export function connectionRedisFactory(redis_string: string) {
  return process.env.REDIS_POWER === 'ON' ? new Redis(redis_string) : null;
}
