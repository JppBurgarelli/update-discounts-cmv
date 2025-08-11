import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';

const idList: string[] = [
  '1523920534188-01',
  '1524940542148-01',
  '1524960542289-01',
  '1524970542327-01',
  '1525080542491-02',
  '1525090557810-01',
  '1525320543715-02',
  '1525430544013-01',
  '1525590544215-01',
  '1525680544434-01',
  '1526560545461-01',
  '1526670545670-01',
  '1526870545989-01',
  '1527040546241-01',
  '1527120546507-01',
  '1527130546520-01',
  '1527170546586-01',
  '1527310546789-02',
  '1527340546893-01',
  '1527390547078-01',
  '1527770547582-01',
  '1528070547950-01',
  '1528220549017-01',
  '1529700556228-01',
  '1529950556573-01',
  '1530420558389-01',
  '1530890563879-01',
  '1531380566981-01',
  '1531400567044-02',
  '1531450567707-01',
  '1531600568290-01',
  '1531630568652-01',
  '1531690569389-01',
  '1531840569946-01',
  '1531890570505-01',
  '1532280572551-01',
  '1532280572574-01',
  '1532290572587-01',
  '1532300572613-01',
  '1532300572627-01',
  '1532330572712-01',
  '1532340572747-02',
  '1532530573055-01',
  '1532540573072-01',
  '1533080573597-02',
  '1533310573947-01',
  '1535460578048-01',
  '1542120596555-01',
  '1542240596974-01',
  '1542860597919-01',
  '1542890587275-01',
  '1543150587407-01',
  '1543160598362-01',
  '1543220587659-01',
  '1543350598618-01',
  '1543360598647-01',
  '1543360598650-02',
  '1543370598680-02',
  '1543390588164-01',
  '1543400598764-01',
  '1543420598792-01',
  '1543420598793-01',
  '1543460598965-01',
  '1543570599041-01',
  '1543580599093-01',
  '1544620602684-01',
  '1545120604834-01',
  '1546210608748-01',
  '1546740610554-02',
  '1546990611644-01',
  '1547000611726-01',
  '1547000611734-01',
  '1547010611743-01',
  '1547020611811-01',
  '1547030611850-01',
  '1547040611890-01',
  '1547050611964-01',
  '1547060612037-01',
  '1547090612075-01',
  '1547090612085-01',
  '1547150612094-01',
  '1547150612095-01',
  '1547170612130-02',
  '1547180612206-01',
  '1547180612222-01',
  '1547190612270-01',
  '1547200612336-01',
  '1547210612409-01',
  '1547900614674-01',
  '1548220615587-02',
  '1548370596461-01',
  '1548490616428-01',
  '1549160596808-01',
  '1549180618262-01',
  '1549360618693-02',
  '1549410618874-01',
  '1549860619747-01',
  '1550090620253-02',
  '1550110620347-01',
  '1550350620978-02',
  '1550350620981-01',
  '1550360620992-01',
  '1550370597560-01',
  '1550380621081-02',
  '1550380621087-02',
  '1550390621102-01',
  '1550390621103-01',
  '1550400621121-01',
  '1550400621125-01',
  '1550400621128-01',
  '1550420597613-01',
  '1550420621187-01',
  '1550430597623-01',
  '1550440621214-02',
  '1550530621262-02',
  '1550530621262-03',
  '1550540621307-01',
  '1550550621333-02',
  '1550660621913-03',
  '1550850622468-01',
  '1550890622583-01',
  '1551020622726-01',
  '1551060622967-01',
  '1551070623016-01',
  '1551090623088-01',
  '1551150623248-01',
  '1551250623361-03',
  '1551280598543-01',
  '1551310623653-04',
  '1551360623869-01',
  '1551550624286-01',
  '1551590624502-03',
  '1551590624526-01',
  '1551610598929-01',
  '1551750624865-01',
  '1552020625870-01',
  '1552020625880-01',
  '1552030625931-01',
  '1552050626033-01',
  '1552060626039-04',
  '1552070626100-01',
  '1552070626112-01',
  '1552080626161-01',
  '1552090626195-01',
  '1552090626207-01',
  '1552090626214-01',
  '1552110626253-01',
  '1552110626254-03',
  '1552190626294-01',
  '1552190626297-01',
  '1552200626339-01',
  '1552200626352-01',
  'CNL-1522021018589-01',
  'CNL-1527521063899-01',
  'MLP-45083634820',
  'MLP-45250079363',
  'MLP-45252156568',
];

type TOrcamentoInfoOutput = { IDESTABELECIMENTO: number; IDORCAMENTO: number };
type TOrcamentoProdutoOutput = { IDPRODUTO: number };
type TEstoqueOutput = { QUANTIDADE: number };
type TKardexOutput = { IDKARDEX: number; QTDEESTOQUE: number };

class LoggerService {
  private readonly logFilePath = './logs/stock-reconciliation.log';

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

export class StockReconciliation {
  private readonly logger = new LoggerService();

  public async execute() {
    for (const vtexId of idList) {
      const orcamentoInfo = await this.getOrcamentoInfoFromMega(vtexId);
      if (!orcamentoInfo) {
        this.logger.log(
          `⚠️ Nenhum orçamento encontrado para vtexId: ${vtexId}`
        );
        continue;
      }

      const produtos = await this.getProdutosFromMega(
        orcamentoInfo.IDORCAMENTO
      );
      if (!produtos.length) {
        this.logger.log(
          `⚠️ Nenhum produto encontrado para orçamento: ${orcamentoInfo.IDORCAMENTO}`
        );
        continue;
      }

      for (const produto of produtos) {
        const estoque = await this.getQuantityEstoqueFromMega(
          produto.IDPRODUTO,
          orcamentoInfo.IDESTABELECIMENTO
        );

        const kardex = await this.getLastKardexFromMega(
          produto.IDPRODUTO,
          orcamentoInfo.IDESTABELECIMENTO
        );

        if (!estoque || !kardex) {
          this.logger.log(
            `⚠️ Estoque ou Kardex não encontrados para produto ${produto.IDPRODUTO} (Orçamento: ${orcamentoInfo.IDORCAMENTO})`
          );
          continue;
        }

        if (estoque.QUANTIDADE !== kardex.QTDEESTOQUE) {
          this.logger.log(
            `DIVERGÊNCIA → Orçamento: ${orcamentoInfo.IDORCAMENTO} | ` +
            `VTEXID: ${vtexId} | ` +
            `Estabelecimento: ${orcamentoInfo.IDESTABELECIMENTO} | ` +
            `Produto: ${produto.IDPRODUTO} | ` +
            `Estoque: ${estoque.QUANTIDADE} | ` +
            `Kardex: ${kardex.QTDEESTOQUE}`
          );
        } else {
          this.logger.log(
            `OK → Orçamento: ${orcamentoInfo.IDORCAMENTO} | ` +
            `VTEXID: ${vtexId} | ` +
            `Estabelecimento: ${orcamentoInfo.IDESTABELECIMENTO} | ` +
            `Produto: ${produto.IDPRODUTO} | ` +
            `Quantidade: ${estoque.QUANTIDADE}`
          );
        }
      }
    }
  }

  private async getLastKardexFromMega(
    idProduto: number,
    idestabelecimento: number
  ): Promise<null | TKardexOutput> {
    const query = `
        SELECT idkardex, qtdeestoque
        FROM (
          SELECT idkardex, qtdeestoque
          FROM t_kardex
          WHERE idproduto = :1
            AND idestabelecimento = :2
          ORDER BY data DESC
        )
        WHERE ROWNUM = 1
    `;

    const result = await MegaAppDataSource.query(query, [
      idProduto,
      idestabelecimento,
    ]);
    return result[0] || null;
  }

  private async getOrcamentoInfoFromMega(
    vtexid: string
  ): Promise<null | TOrcamentoInfoOutput> {
    const query = `
      SELECT idorcamento, idestabelecimento
      FROM t_orcamento
      WHERE pedidoecommerce = :1
    `;
    const result = await MegaAppDataSource.query(query, [vtexid]);
    return result[0] || null;
  }

  private async getProdutosFromMega(
    idOrcamento: number
  ): Promise<TOrcamentoProdutoOutput[]> {
    const query = `
      SELECT idproduto
      FROM t_orcamentoproduto
      WHERE idorcamento = :1
    `;
    return MegaAppDataSource.query(query, [idOrcamento]);
  }

  private async getQuantityEstoqueFromMega(
    idProduto: number,
    idestabelecimento: number
  ): Promise<null | TEstoqueOutput> {
    const query = `
      SELECT quantidade
      FROM t_estoque
      WHERE idproduto = :1
        AND idestabelecimento = :2
    `;
    const result = await MegaAppDataSource.query(query, [
      idProduto,
      idestabelecimento,
    ]);
    return result[0] || null;
  }
}
