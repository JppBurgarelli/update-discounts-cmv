import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';
import { SentryDatasource } from '../db/sentry-datasource';

type OrderFromSentryOutput = {
  discounts: number;
  vtex_id: string;
};

type MegaDiscountQueryOutput = {
  DESCONTOVALOR: number | string;
};

export class CmvCorrectionService {
  private readonly logFilePath = './logs/order-service.log';
  private skippedCount = 0;
  private updatedCount = 0;

  public async correctDiscountValues(): Promise<void> {
    try {
      const orders = await this.getOrdersFromSentry();

      for (const order of orders) {
        if (order.vtex_id && order.discounts > 0) {
          await this.updateOrderInMega(order.vtex_id, order.discounts);
          await this.sleep(1000);
        }
      }

      this.logMessage(`Finished updating orders.`);
      this.logMessage(
        `Resumo: ${this.updatedCount} atualizados, ${this.skippedCount} ignorados.`
      );
      console.log(
        `Resumo: ${this.updatedCount} atualizados, ${this.skippedCount} ignorados.`
      );
    } catch (error) {
      this.logMessage(`Critical failure: ${error.message}`);
    }
  }

  private async getOrdersFromSentry(): Promise<OrderFromSentryOutput[]> {
    const query = `
    SELECT vtex_id, discounts 
    FROM orders 
    WHERE created_at BETWEEN TO_DATE('27/03/2025', 'DD/MM/YYYY') AND TO_DATE('13/06/2025', 'DD/MM/YYYY')
    AND discounts > 0
    FETCH FIRST 5 ROWS ONLY;
    `;

    try {
      const result = await SentryDatasource.query(query);
      this.logMessage(`Fetched ${result.length} orders from Sentry`);
      return result;
    } catch (error) {
      this.logMessage(`Failed to fetch orders from Sentry: ${error.message}`);
      throw error;
    }
  }

  private logMessage(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    const logDir = './logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    fs.appendFileSync(this.logFilePath, logEntry, 'utf8');
  }

  private async shouldUpdateDiscount(
    vtexId: string,
    newDiscount: number
  ): Promise<boolean> {
    const selectQuery = `
    SELECT DESCONTOVALOR
    FROM t_orcamento
    WHERE PEDIDOECOMMERCE = :1
  `;

    try {
      const result: MegaDiscountQueryOutput[] = await MegaAppDataSource.query(
        selectQuery,
        [vtexId]
      );

      if (result.length === 0) {
        this.logMessage(`Order ${vtexId} not found in Mega`);
        return false;
      }

      const currentDiscount = Number(result[0].DESCONTOVALOR) || 0;
      this.logMessage(
        `Order ${vtexId}, discount ${result[0].DESCONTOVALOR} mega & discount ${newDiscount} sentry`
      );
      return currentDiscount !== newDiscount;
    } catch (error) {
      this.logMessage(
        `Error fetching discount for order ${vtexId}: ${error.message}`
      );
      return false;
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async updateOrderInMega(
    vtexId: string,
    discount: number
  ): Promise<void> {
    const shouldUpdate = await this.shouldUpdateDiscount(vtexId, discount);

    if (!shouldUpdate) {
      this.skippedCount++;
      this.logMessage(
        `Skipped update for ${vtexId} and R$${discount} (already up-to-date) `
      );
      return;
    }

    const updateQuery = `
      UPDATE t_orcamento
      SET DESCONTOVALOR = :1
      WHERE PEDIDOECOMMERCE = :2
    `;

    try {
      await MegaAppDataSource.query(updateQuery, [discount, vtexId]);
      this.updatedCount++;
      this.logMessage(`Updated order ${vtexId} with discount ${discount}`);
    } catch (error) {
      this.logMessage(
        `Failed to update Mega for vtex_id ${vtexId}: ${error.message}`
      );
    }
  }
}
