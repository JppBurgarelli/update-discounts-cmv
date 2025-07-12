/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';

import { cmvCorrectionTwoController } from '../controllers/cmv-correction-two-controller';
import { ControllerMethodExample } from '../controllers/controller-example';
import { cmvController } from '../controllers/orders-controller';
import { verifyEmployeeHandler } from '../controllers/verify-seller-controller';

export const Routes = async (app: FastifyInstance) => {
  app.get('/cmv-correction', cmvController);
  app.get('/cmv-correction-two', cmvCorrectionTwoController);
  app.get('/verify-emplyee', verifyEmployeeHandler);
  app.get('/RoutePatheExample', ControllerMethodExample);
};
