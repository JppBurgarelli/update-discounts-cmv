import { DataSource } from 'typeorm';

import { Orcamento } from '../entities/orcamento.entity';
import { env } from '../env';

export const MegaAppDataSource = new DataSource({
  entities: [Orcamento],
  host: env.ORACLE_DB_HOST,
  logger: 'advanced-console',
  logging: true,
  password: env.ORACLE_DB_PASSWORD,
  port: 1521,
  serviceName: env.ORACLE_DB_SERVICE_NAME,
  thickMode: true,
  type: 'oracle',
  username: env.ORACLE_DB_NAME,
});
