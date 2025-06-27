import type { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ServiceExample } from '../services/service-example';

export const ControllerMethodExample = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const serviceExample = new ServiceExample();
    const products = await serviceExample.execute();

    return reply.status(200).send({
      data: products,
      message: 'Products processed successfully',
    });
  } catch (error) {
    console.error('Error processing products:', error);
    return reply.status(500).send({
      error: 'Internal error while processing products',
    });
  }
};
