import { DataSource } from 'typeorm';

import { env } from '../env';

export const SentryDatasource = new DataSource({
  database: env.SENTRY_DB_SERVICE_NAME,
  extra: {
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  },
  host: env.SENTRY_DB_HOST,
  logging: true,
  password: env.SENTRY_DB_PASSWORD,
  port: 5432,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
  type: 'postgres',
  username: env.SENTRY_DB_NAME,
});
