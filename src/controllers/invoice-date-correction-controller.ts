import type { FastifyReply, FastifyRequest } from 'fastify';

import { InvoiceDateCorrectionService } from '../services/invoice-date-correction-service';

export const invoiceDateCorrectionController = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const c = new InvoiceDateCorrectionService();
    await c.execute();

    return reply
      .status(200)
      .send({ message: 'Correção de datas concluída com sucesso.' });
  } catch (error) {
    console.error('Error correctinc date in orcamentos in Mega:', error);
    return reply
      .status(500)
      .send({ message: 'Erro interno ao processar a correção.' });
  }
};
