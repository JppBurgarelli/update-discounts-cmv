/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

export const setupHealthCheck = async (app: FastifyInstance): Promise<void> => {
  app.get('/healthcheck', async (_, reply) =>
    reply.code(200).send({ status: 'Running :)' })
  );
};
