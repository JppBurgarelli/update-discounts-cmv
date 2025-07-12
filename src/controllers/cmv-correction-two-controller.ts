import type { FastifyReply, FastifyRequest } from 'fastify';

import { CmvCorrectionServiceTwo } from '../services/cmv-correction-two';

export const cmvCorrectionTwoController = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const c = new CmvCorrectionServiceTwo();
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
