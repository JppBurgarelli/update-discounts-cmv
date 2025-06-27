import apm from 'elastic-apm-node';

import { env } from '../env';

apm.start({
  environment: env.NODE_ENV || 'development',
  serverUrl: env.ELASTIC_APM_SERVER_URL,
  serviceName: env.ELASTIC_APM_SERVICE_NAME,
});

export { apm };
