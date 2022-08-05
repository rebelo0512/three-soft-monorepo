import { config } from 'dotenv';
import { connectionMysqlFactory } from '.';

/* c8 ignore start */
config({
  path: `${__dirname}/../../../../../../../${process.env.NODE_ENV === 'test' ? '.env.test' : '.env'}`
});

export const DatabaseMysqlConnection = connectionMysqlFactory({
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT) ?? 3306,
  database: process.env.DATABASE_NAME ?? 'three-soft',
  username: process.env.DATABASE_USERNAME ?? 'user',
  password: process.env.DATABASE_PASSWORD ?? 'password'
});
/* c8 ignore stop */
