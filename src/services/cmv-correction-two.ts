import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';
import { SentryDatasource } from '../db/sentry-datasource';

type OrderFromSentryOutput = {
  discounts: number;
  freight_value: number;
  id: number;
  total: number;
  vtex_id: string;
};

type MegaDiscountQueryOutput = {
  DESCONTOPERCENTUAL: number;
  DESCONTOVALOR: number | string;
  VALORBRUTO: number;
};

class LoggerService {
  private readonly logFilePath = './logs/log-orcamento-orcamento-produto.log';

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

class OrderUpdater {
  constructor(private logger: LoggerService) { }

  public async updateIfNeededOrcamentoFromMega(
    orderId: number,
    vtexId: string,
    discount: number,
    freight_value: number,
    valorLiquido: number
  ): Promise<boolean> {
    const selectQuery = `
      SELECT DESCONTOVALOR
      FROM T_ORCAMENTO
      WHERE PEDIDOECOMMERCE = :1
    `;

    const result: MegaDiscountQueryOutput[] = await MegaAppDataSource.query(
      selectQuery,
      [vtexId]
    );

    if (result.length === 0) {
      this.logger.log(`Order ${vtexId} not found in Mega`);
      return false;
    }

    const currentDiscountFromMega = Number(result[0].DESCONTOVALOR) || 0;

    if (currentDiscountFromMega !== discount) {
      await MegaAppDataSource.query(
        `UPDATE T_ORCAMENTO SET DESCONTOVALOR = :1 WHERE PEDIDOECOMMERCE = :2`,
        [discount, vtexId]
      );
      this.logger.log(`Updated DESCONTOVALOR for ${vtexId}`);
    } else {
      this.logger.log(`This discount for ${vtexId} is already up to date`);
    }

    const valorBruto = valorLiquido + discount - freight_value;
    if (valorBruto === 0) {
      this.logger.log(
        `VALORBRUTO is zero for ${vtexId}, cannot compute discount percentage.`
      );
      return false;
    }

    const discountPercentage =
      Math.round(((100 * discount) / valorBruto) * 100) / 100;

    const getQuantityFromSentry = `SELECT quantity FROM items WHERE order_id = $1`;
    const getQuantity: { quantity: number }[] = await SentryDatasource.query(
      getQuantityFromSentry,
      [orderId]
    );

    if (!getQuantity.length) {
      this.logger.log(`No quantity records found for ${vtexId}`);
      return false;
    }

    const totalQuantity = getQuantity.reduce(
      (acc, cv) => acc + Number(cv.quantity),
      0
    );

    if (!totalQuantity) {
      this.logger.log(`Total quantity is zero for ${vtexId}`);
      return false;
    }

    const queryUpdateDescontoPercentual = `
      UPDATE T_ORCAMENTO
      SET DESCONTOPERCENTUAL = :1,
          VALORBRUTO = :2,
          VALOR = :3,
          TOTALDEPECAS = :4
      WHERE PEDIDOECOMMERCE = :5
    `;

    await MegaAppDataSource.query(queryUpdateDescontoPercentual, [
      discountPercentage,
      valorBruto,
      valorLiquido,
      totalQuantity,
      vtexId,
    ]);

    this.logger.log(
      `Updated DESCONTOPERCENTUAL, VALORBRUTO, VALORLIQUIDO and TOTALDEPECAS for ${vtexId}`
    );
    return true;
  }
}

class ProductUpdater {
  constructor(private logger: LoggerService) { }

  public async updateOrcamentoProdutoFromMega(vtexId: string): Promise<void> {
    const orcamentoQuery = `
      SELECT IDORCAMENTO, DESCONTOPERCENTUAL
      FROM T_ORCAMENTO
      WHERE PEDIDOECOMMERCE = :1
    `;

    const result = await MegaAppDataSource.query(orcamentoQuery, [
      '1545820607546-02',
    ]);
    if (result.length === 0) {
      this.logger.log(`No orcamento found for ${vtexId}`);
      return;
    }

    const { DESCONTOPERCENTUAL, IDORCAMENTO } = result[0];

    const updateProdutosQuery = `
    UPDATE T_ORCAMENTOPRODUTO OP
    SET
      OP.DESCONTOVALOR = ROUND((:1 / 100) * OP.VALORVENDA, 2),
      OP.CUSTOMEDIOPRODUTOCONSOLIDADO = ROUND(OP.CUSTOMEDIOPRODUTO * OP.QUANTIDADE, 2),
      OP.CUSTOBRUTO = (
        SELECT RP.CUSTOBRUTO
        FROM T_PRODUTO P
        JOIN T_REFERENCIAPRODUTO RP ON P.IDREFERENCIAPRODUTO = RP.IDREFERENCIAPRODUTO
        WHERE P.IDPRODUTO = OP.IDPRODUTO AND ROWNUM = 1
      )
    WHERE OP.IDORCAMENTO = :2
  `;

    await MegaAppDataSource.query(updateProdutosQuery, [
      DESCONTOPERCENTUAL,
      IDORCAMENTO,
    ]);
    this.logger.log(`Updated produtos for IDORCAMENTO ${IDORCAMENTO}`);
  }
}

export class CmvCorrectionServiceTwo {
  private readonly logger = new LoggerService();
  private readonly orderUpdater = new OrderUpdater(this.logger);
  private readonly productUpdater = new ProductUpdater(this.logger);
  private skippedCount = 0;
  private updatedCount = 0;

  public async correctDiscountValues(): Promise<void> {
    try {
      const orders = await this.getOrdersFromSentry();

      for (const order of orders) {
        if (!order.vtex_id || order.discounts < 0) {
          this.skippedCount++;
          continue;
        }

        const updated = await this.orderUpdater.updateIfNeededOrcamentoFromMega(
          order.id,
          '1545820607546-02',
          order.discounts,
          order.freight_value,
          order.total
        );

        if (updated) {
          await this.productUpdater.updateOrcamentoProdutoFromMega(
            '1545820607546-02'
          );
          this.updatedCount++;
          await this.sleep(1000);
        } else {
          this.skippedCount++;
        }
      }

      this.logger.log(
        `Finished. Atualizados: ${this.updatedCount}, Ignorados: ${this.skippedCount}`
      );
      console.log(
        `Resumo: ${this.updatedCount} atualizados, ${this.skippedCount} ignorados.`
      );
    } catch (error: any) {
      this.logger.log(`Critical failure: ${error.message}`);
    }
  }

  private async getOrdersFromSentry(): Promise<OrderFromSentryOutput[]> {
    const query = `
                SELECT id, vtex_id, discounts, freight_value, total
                FROM orders
                WHERE created_at BETWEEN TO_DATE('27/03/2025', 'DD/MM/YYYY') AND TO_DATE('13/06/2025', 'DD/MM/YYYY')
                  ORDER BY created_at DESC
                FETCH FIRST 5 ROWS ONLY
    `;

    try {
      const result = await SentryDatasource.query(query);
      this.logger.log(`Fetched ${result.length} orders from Sentry`);
      return result;
    } catch (error: any) {
      this.logger.log(`Failed to fetch orders: ${error.message}`);
      return [];
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
