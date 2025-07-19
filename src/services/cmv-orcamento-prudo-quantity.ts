import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';
import { SentryDatasource } from '../db/sentry-datasource';

type getIdOrcamentoFromMega = {
  DESCONTOPERCENTUAL: number;
  IDORCAMENTO: number;
};

class LoggerService {
  private readonly logFilePath = './logs/log-orcamento-produto-quantidade.log';

  public log(message: string): void {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] ${message}\n`;

    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(this.logFilePath, entry, 'utf8');
  }
}

export class CmvOrcamentoProdutoQuantityCorrection {
  private readonly logger = new LoggerService();
  private skippedCount = 0;
  private updatedCount = 0;

  public async execute() {
    const orcamentos = await this.getOrcamentosFromMegaToUpdate();
    this.logger.log(`Iniciando correção de ${orcamentos.length} orçamentos.`);

    for (const orcamento of orcamentos) {
      try {
        await this.updateorcamentoprodutodescontovalor(
          orcamento.IDORCAMENTO,
          orcamento.DESCONTOPERCENTUAL
        );

        this.updatedCount++;
        this.logger.log(
          `✅ Orçamento ${orcamento.IDORCAMENTO} atualizado com sucesso.`
        );
      } catch (error) {
        this.skippedCount++;
        this.logger.log(
          `❌ Erro ao atualizar orçamento ${orcamento.IDORCAMENTO}: ${(error as Error).message}`
        );
      }
    }

    this.logger.log(`Processo concluído.`);
    this.logger.log(`Total atualizados: ${this.updatedCount}`);
    this.logger.log(`Total com erro: ${this.skippedCount}`);
  }

  private async getOrcamentosFromMegaToUpdate(): Promise<
    getIdOrcamentoFromMega[]
  > {
    const queryToGetOrcamentosToUpdate = `
      SELECT
        DESCONTOPERCENTUAL,
        IDORCAMENTO
      FROM T_ORCAMENTO t
      WHERE
        t.DATA BETWEEN TO_DATE('27/03/2025', 'DD/MM/YYYY') AND TO_DATE('18/07/2025', 'DD/MM/YYYY')
        AND t.PEDIDOECOMMERCE IS NOT NULL
        AND t.IDESTABELECIMENTO <> 369
        AND t.DESCONTOVALOR > 1
        AND t.TOTALDEPECAS > 1
      ORDER BY t.DATA DESC
    `;

    return SentryDatasource.query<getIdOrcamentoFromMega[]>(
      queryToGetOrcamentosToUpdate
    );
  }

  private async updateorcamentoprodutodescontovalor(
    idOrcamento: number,
    descontoPercentual: number
  ): Promise<void> {
    const query = `
      UPDATE T_ORCAMENTOPRODUTO OP
      SET OP.DESCONTOVALOR = ROUND((:desconto / 100) * OP.VALORVENDA * OP.QUANTIDADE, 2)
      WHERE OP.IDORCAMENTO = :idOrcamento
    `;

    await MegaAppDataSource.query(query, [descontoPercentual, idOrcamento]);
  }
}
