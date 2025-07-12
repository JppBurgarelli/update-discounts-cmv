import type { FastifyReply, FastifyRequest } from 'fastify';

import { EmployeeVerification } from '../services/employee-verfication';

export const verifyEmployeeHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const employeeService = new EmployeeVerification();

  try {
    await employeeService.employeeVerification();

    reply.status(200).send({
      message: 'Verificação de funcionários concluída com sucesso.',
    });
  } catch (error) {
    console.error(
      '[EmployeeVerification] Erro ao executar verificação:',
      error
    );

    reply.status(500).send({
      error: error instanceof Error ? error.message : String(error),
      message: 'Erro interno ao processar a verificação de funcionários.',
    });
  }
};
