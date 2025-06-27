import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

import { MegaAppDataSource } from '../db/mega-datasource';

export enum OrcamentoStatus {
  ESTORNADO = 'E',
}

@Entity({
  name: 'T_ORCAMENTO',
  schema: 'MSTORE',
})
export class Orcamento {
  @Column({ name: 'ACRESCIMOPERCENTUAL', type: 'number' })
  acrescimoPercentual!: number;

  @Column({ name: 'AUTOATENDIMENTO', type: 'varchar' })
  autoAtendimento!: string;

  @Column({ name: 'CHAVESEGURANCA', type: 'varchar' })
  chaveSeguranca!: string;

  @Column({ name: 'CODIGOAB', type: 'number' })
  codigoAb!: number;

  @Column({ name: 'CODIGOCONDICAOPAGAMENTOCARDS', type: 'number' })
  codigoCondicaoPagamentoCards!: number;

  @Column({ name: 'CODIGOEXTERNO', type: 'varchar' })
  codigoExterno!: string;

  @Column({ name: 'CODIGORESGATEFIDELIDADE', type: 'varchar' })
  codigoResgateFidelidade!: string;

  @Column({ name: 'CODIGOVALEFUNCIONARIO', type: 'varchar' })
  codigoValeFuncionario!: string;

  @Column({ name: 'CPFCNPJ', type: 'varchar' })
  cpfCnpj!: string;

  @Column({ name: 'CPFCNPJDEPENDENTE', type: 'varchar' })
  cpfCnpjDependente!: string;

  @Column({ name: 'DATA', type: 'timestamp' })
  data!: string;

  @Column({ name: 'DATACANCELAMENTO', type: 'timestamp' })
  dataCancelamento!: string;

  @Column({ name: 'DATACONFIRMACAO', type: 'timestamp' })
  dataConfirmacao!: string;

  @Column({ name: 'DESCONTOFIDELIDADE', type: 'number' })
  descontoFidelidade!: number;

  @Column({ name: 'DESCONTOVALOR', type: 'number' })
  descontoValor!: number;

  @Column({ name: 'DESCONTOPERCENTUAL', type: 'number' })
  descontPercentual!: number;

  @Column({ name: 'DESCRICONDICAOPAGAMENTOCARDS', type: 'varchar' })
  descriCondicaoPagamentoCards!: string;

  @Column({ name: 'DEVEOFERTARFIDELIDADE', type: 'varchar' })
  deveOfertarFidelidade!: string;

  @Column({ name: 'FIDELIDADEATIVA', type: 'varchar' })
  fidelidadeAtiva!: string;

  @Column({ name: 'IDCAIXA', type: 'number' })
  idCaixa!: number;

  @Column({ name: 'IDCLIENTE', type: 'number' })
  idCliente!: number;

  @Column({ name: 'IDCONDICAOPAGAMENTO', type: 'number' })
  idCondicaoPagamento!: number;

  @Column({ name: 'IDCUPOMDESCONTOCLIENTE', type: 'number' })
  idCupomDescontocliente!: number;

  @Column({ name: 'IDESTABELECIMENTO', type: 'number' })
  idEstabelecimento!: number;

  @Column({ name: 'IDLOJAVENDEDOR', type: 'number' })
  idLojaVendedor!: number;

  @Column({ name: 'IDMICROSERVICOFIDELIDADE', type: 'number' })
  idMicroservicoFidelidade!: number;

  @PrimaryColumn({ name: 'IDORCAMENTO', type: 'number' })
  idOrcamento!: number;

  @Column({ name: 'IDPONTOVENDA', type: 'number' })
  idPontovenda!: number;

  @Column({ name: 'IDTRANSACAOSOLUCX', type: 'number' })
  idTransacaoSolucx!: number;

  @Column({ name: 'IDTROCA', type: 'number' })
  idTroca!: number;

  @Column({ name: 'IDULTIMOHISTORICOPESQUISASPC', type: 'number' })
  idUltimoHistoricopesquisaspc!: number;

  @Column({ name: 'IDULTIMOHISTORICOSPCSCORE', type: 'number' })
  idUltimoHistoricoSpcscore!: number;

  @Column({ name: 'IDUSUARIO', type: 'number' })
  idUsuario!: number;

  @Column({ name: 'IDUSUARIOAUTORIZACAO', type: 'number' })
  idUsuarioAutorizacao!: number;

  @Column({ name: 'IDUSUARIOCAIXA', type: 'number' })
  idUsuarioCaixa!: number;

  @Column({ name: 'IDUSUARIOCANCELAMENTO', type: 'number' })
  idUsuarioCancelamento!: number;

  @Column({ name: 'IDUSUARIOCONFERENCIA', type: 'number' })
  idUsuarioConferencia!: number;

  @Column({ name: 'IDVENDA', type: 'varchar' })
  idVenda!: string;

  @Column({ name: 'IDVENDEDOR', type: 'number' })
  idVendedor!: number;

  @Column({ name: 'INTEGRADOR', type: 'varchar' })
  integrador!: string;

  @Column({ name: 'NOMECLIENTE', type: 'varchar' })
  nomeCliente!: string;

  @Column({ name: 'OBSERVACAO', type: 'varchar' })
  observacao!: string;

  @Column({ name: 'OBSERVACAOCANCELAMENTO', type: 'varchar' })
  observacaoCancelamento!: string;

  @Column({ name: 'ORCAMENTOBAIXADO', type: 'varchar' })
  orcamentoBaixado!: string;

  @Column({ name: 'ORCAMENTOEDITADOFLAG', type: 'varchar' })
  orcamentoEditadoFlag!: string;

  @Column({ name: 'ORCAMENTOWEBSTOREFLAG', type: 'varchar' })
  orcamentoWebstoreFlag!: string;

  @Column({ name: 'PEDIDOECOMMERCE', type: 'varchar' })
  pedidoEcommerce!: string;

  @Column({ name: 'PERFILCLIENTE', type: 'number' })
  perfilCliente!: number;

  @Column({ name: 'RETIRADODOESTOQUE', type: 'varchar' })
  retiradodoEstoque!: string;

  @Column({ name: 'STATUS', type: 'varchar' })
  status!: OrcamentoStatus;

  @Column({ name: 'STATUSCONFERENCIA', type: 'varchar' })
  statusConferencia!: string;

  @Column({ name: 'STATUSRESGATEFIDELIDADE', type: 'varchar' })
  statusResgateFidelidade!: string;

  @Column({ name: 'TEMPO', type: 'number' })
  tempo!: number;

  @Column({ name: 'TICKET', type: 'varchar' })
  ticket!: string;

  @Column({ name: 'TIPOCUPOMDESCONTO', type: 'varchar' })
  tipoCupomDesconto!: string;

  @Column({ name: 'TOTALDEPECAS', type: 'number' })
  totalDePecas!: number;

  @Column({ name: 'UUIDMICROSERVICO', type: 'varchar' })
  uuidMicroservico!: string;

  @Column({ name: 'UUIDMICROSERVICOFIDELIDADE', type: 'varchar' })
  uuidMicroservicoFidelidade!: string;

  @Column({ name: 'VALEFUNCIONARIO', type: 'varchar' })
  valeFuncionario!: string;

  @Column({ name: 'VALOR', type: 'number' })
  valor!: number;

  @Column({ name: 'VALORBRUTO', type: 'number' })
  valorBruto!: number;

  @Column({ name: 'VALORCASHBACK', type: 'number' })
  valorCashback!: number;

  @Column({ name: 'VALORCUPOMDESCONTO', type: 'number' })
  valorCupomDesconto!: number;

  @Column({ name: 'VALORFRETE', type: 'number' })
  valorFrete!: number;

  @Column({ name: 'VALORKITDESCONTO', type: 'number' })
  valorKitDesconto!: number;

  @BeforeInsert()
  async beforeInsert(): Promise<void> {
    if (!this.idOrcamento) {
      const nextVal = await MegaAppDataSource.query(
        `select MSTORE.S_ORCAMENTO.NEXTVAL as id from dual`
      );
      this.idOrcamento = nextVal[0].ID;
    }
  }
}
