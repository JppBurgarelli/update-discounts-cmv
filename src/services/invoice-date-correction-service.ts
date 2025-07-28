import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';
import { SentryDatasource } from '../db/sentry-datasource';

type TOrdersFromMega = {
  DATA: Date;
  PEDIDOECOMMERCE: string;
};

type TOrderRecord = {
  id: number;
  status: string;
};

class LoggerService {
  private readonly logFilePath = './logs/invoice-date-correction.log';

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

export class InvoiceDateCorrectionService {
  private readonly logger = new LoggerService();

  public async execute() {
    const updatedVtexIds: string[] = [];
    const ordersFromMega: TOrdersFromMega[] = await this.getOrderListFromMega();

    for (const orderFromMega of ordersFromMega) {
      try {
        const orderId: number = await this.getOrderid(
          orderFromMega.PEDIDOECOMMERCE
        );

        const nfeDate: Date = await this.getNfeDate(orderId);

        const adjustedNfeDate = new Date(nfeDate);
        adjustedNfeDate.setHours(adjustedNfeDate.getHours() - 3);

        if (this.shouldUpdateDate(orderFromMega.DATA, adjustedNfeDate)) {
          await this.updateOrcamentoDataInMega(
            orderFromMega.PEDIDOECOMMERCE,
            adjustedNfeDate
          );
          this.logger.log(
            `✅ ${orderFromMega.PEDIDOECOMMERCE} updated successfully from (${orderFromMega.DATA}) to (${adjustedNfeDate})`
          );
          updatedVtexIds.push(orderFromMega.PEDIDOECOMMERCE);
        }
      } catch (error) {
        this.logger.log(
          `❌ Error processing ${orderFromMega.PEDIDOECOMMERCE}: ${error}`
        );
      }

      await this.sleep(500);
    }

    if (updatedVtexIds.length > 0) {
      const message = `(✅ Total updated: ${updatedVtexIds.length} | vtexIds: ${updatedVtexIds.join(', ')} `;
      console.log(message);
      this.logger.log(message);
    } else {
      const message = `⚠ Nenhuma atualização foi necessária.`;
      console.log(message);
      this.logger.log(message);
    }
  }

  private async getNfeDate(orderId: number): Promise<Date> {
    const query = `select created_at from nfes where order_id = $1`;
    const result = await SentryDatasource.query(query, [orderId]);
    return new Date(result[0].created_at);
  }

  private async getOrderid(vtexId: string): Promise<number> {
    const query = `SELECT id, status FROM orders WHERE vtex_id = $1`;
    const orders: TOrderRecord[] = await SentryDatasource.query(query, [
      vtexId,
    ]);

    const [primaryOrder, fallbackOrder] = orders;

    if (primaryOrder.status === 'troca_loja' && fallbackOrder) {
      return fallbackOrder.id;
    }

    return primaryOrder.id;
  }

  private async getOrderListFromMega(): Promise<TOrdersFromMega[]> {
    const query = `
                SELECT DATA, PEDIDOECOMMERCE
                FROM T_ORCAMENTO
                WHERE DATA >= TO_DATE('01/07/2025', 'DD/MM/YYYY')
                AND idestabelecimento <> 369
                AND PEDIDOECOMMERCE IS NOT NULL 
    `;

    const result = await MegaAppDataSource.query(query);

    return result;
  }

  private shouldUpdateDate(megaDate: Date, sentryDate: Date): boolean {
    const diffMs = Math.abs(megaDate.getTime() - sentryDate.getTime());
    const diffMinutes = diffMs / (1000 * 60);
    const fifteenHoursInMinutes = 15 * 60;
    return diffMinutes > fifteenHoursInMinutes;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async updateOrcamentoDataInMega(
    vtexId: string,
    nfeDate: Date
  ): Promise<void> {
    const query = `update t_orcamento set DATA = : 1 where PEDIDOECOMMERCE = : 2`;
    await MegaAppDataSource.query(query, [nfeDate, vtexId]);
  }
}
