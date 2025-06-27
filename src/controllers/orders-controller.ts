import type { FastifyReply, FastifyRequest } from 'fastify';

import { CmvCorrectionService } from '../services/cmv-correction-service';

export const cmvController = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    const c = new CmvCorrectionService();
    await c.correctDiscountValues();

    return reply
      .status(200)
      .send({ message: 'Correção concluída com sucesso.' });
  } catch (error) {
    console.error('Error updating discount values:', error);
    return reply
      .status(500)
      .send({ message: 'Erro interno ao processar a correção.' });
  }
};
