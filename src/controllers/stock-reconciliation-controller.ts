import type { FastifyReply, FastifyRequest } from 'fastify';

import { StockReconciliation } from '../services/stock-reconciliation';

export const StockReconciliationController = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const c = new StockReconciliation();
    await c.execute();

    return reply.status(200).send({
      message:
        'Correção entre t_estoque, t_kardex e vtex concluída com sucesso.',
    });
  } catch (error) {
    console.error('Error updating t_estoque, t_kardex e vtex:', error);
    return reply.status(500).send({
      message:
        'Erro interno ao processar correcao da t_estoque, t_kardex e vtex.',
    });
  }
};
