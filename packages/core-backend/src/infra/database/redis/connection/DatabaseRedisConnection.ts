import { config } from 'dotenv';
import { connectionRedisFactory } from './connectionRedisFactory';

/* c8 ignore start */
config({
  path: `${__dirname}/../../../../../../../${process.env.NODE_ENV === 'test' ? '.env.test' : '.env'}`
});

export const DatabaseRedisConnection = connectionRedisFactory(String(process.env.REDIS_STRING));
/* c8 ignore stop */
