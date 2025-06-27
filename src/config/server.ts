import 'reflect-metadata';

import { MegaAppDataSource } from '../db/mega-datasource';
import { SentryDatasource } from '../db/sentry-datasource';
import { env } from '../env';
import { apm } from './apm';
import { app } from './app';

app.addHook('onRequest', (request, reply, done) => {
  if (request.url === '/healthcheck') {
    return done();
  }

  const transaction = apm.startTransaction(
    `${request.method} ${request.url}`,
    'request'
  );

  if (transaction) {
    transaction.addLabels({ project: 'Hub-Ecommerce' });
    (request as any).apmTransaction = transaction;
  }

  done();
});

app.addHook('onResponse', (request, reply, done) => {
  const transaction = (request as any).apmTransaction;

  if (transaction) {
    transaction.setResult(reply.statusCode.toString());
    transaction.end();
  }

  done();
});

async function initializeDatabases() {
  try {
    await MegaAppDataSource.initialize();
    console.log('✅ MegaAppDataSource connected!');

    await SentryDatasource.initialize();
    console.log('✅ SentryDatasource connected!');
  } catch (error) {
    console.error('❌ Error initializing databases:', error);
    process.exit(1);
  }
}

initializeDatabases().then(() => {
  app
    .listen({
      host: '0.0.0.0',
      port: env.APP_PORT,
    })
    .then(() => {
      console.log(`🚀 Server is running on port ${env.APP_PORT}`);
    });
});
