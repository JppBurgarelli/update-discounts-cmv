/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { ControllerMethodExample } from '../controllers/controller-example';
import { cmvController } from '../controllers/orders-controller';

export const Routes = async (app: FastifyInstance) => {
  app.get('/cmv-correction', cmvController);
  app.get('/RoutePatheExample', ControllerMethodExample);
};
