import axios from 'axios';
import * as fs from 'fs';

import { MegaAppDataSource } from '../db/mega-datasource';
import { env } from '../env';

export class EmployeeVerification {
  private readonly logFilePath = './logs/employeeVerification-service.log';

  private readonly mockData = [
    { orderId: '1542690597761-01', sellerName: 'Mara Regina De Jesus Santos' },
    { orderId: '1542910598068-01', sellerName: 'Rodrigo Moreira Dourado' },
    { orderId: '1543100598253-02', sellerName: 'Bianca Salvador Quintanilha' },
    { orderId: '1543340598570-01', sellerName: 'Paloma Cristina Da Costa' },
    { orderId: '1542640597615-01', sellerName: 'Lucimar Pedroso Da Silva' },
    {
      orderId: '1542660597702-01',
      sellerName: 'Daniel Alexandre Camargo Francisco',
    },
    { orderId: '1542690597763-01', sellerName: 'Felipe Costa Barbosa' },
    {
      orderId: '1542870597945-01',
      sellerName: 'Emanuelle Yukari Aires Miyamoto',
    },
    { orderId: '1542680597735-01', sellerName: 'Sthefany Vieira Dos Santos' },
    { orderId: '1543160598372-01', sellerName: 'Tiago Henrique Pereira' },
    { orderId: '1543140598340-01', sellerName: 'Sandra Leal' },
    { orderId: '1542860597913-01', sellerName: 'Vinicius Bueno Souza E Silva' },
    { orderId: '1542910598049-01', sellerName: 'Alan Rogerio Grillo' },
    { orderId: '1540990594422-01', sellerName: 'Rodrigo Barbosa Cardoso' },
    { orderId: '1543170598382-01', sellerName: 'Matheus De Oliveira Mello' },
    { orderId: '1543160598359-01', sellerName: 'Tatiane Rosa De Souza' },
    {
      orderId: '1542620597577-01',
      sellerName: 'Maria Da Conceicao Marciano Figueira',
    },
    { orderId: '1543410598774-01', sellerName: 'Adriana Fernandes Da Silva' },
    {
      orderId: '1542850597898-01',
      sellerName: 'Micaeli Carolina Natal Pereira Da Cruz',
    },
    { orderId: '1542880597955-01', sellerName: 'Cleidiano Dos Santos' },
    { orderId: '1543380598697-03', sellerName: 'Bianca Salvador Quintanilha' },
    {
      orderId: '1543430598829-01',
      sellerName: 'Natalia Cristina Portes D Oliveira Costa',
    },
    { orderId: '1543140598341-01', sellerName: 'Leandro Da Silva Cardoso' },
    { orderId: '1543380598691-01', sellerName: 'Gustavo Magalhaes Garcia' },
    { orderId: '1543330598554-01', sellerName: 'Milton Pastor Da Silva' },
    { orderId: '1543380598701-01', sellerName: 'Renata Cristina Fortuna' },
    { orderId: '1543140598339-01', sellerName: 'Cauane De Souza Viana Ferrao' },
    { orderId: '1543350598619-01', sellerName: 'Vendedor não cadastrado' },
    { orderId: '1542690597757-01', sellerName: 'Bianca Salvador Quintanilha' },
    {
      orderId: '1542660597706-01',
      sellerName: 'Rebecca Leticia De Souza Lima',
    },
    {
      orderId: '1542940598120-01',
      sellerName: 'Danieli Aparecida De Lima Ribeiro',
    },
    { orderId: '1542970598182-01', sellerName: 'Alison Belo De Oliveira' },
    { orderId: '1543170598396-01', sellerName: 'Ailton Machado Dos Santos' },
    { orderId: '1542630597607-01', sellerName: 'Jhully Kelly Vieira Silva' },
    {
      orderId: '1542890597995-01',
      sellerName: 'Marcus Vinicius Silva Lima Ludovino',
    },
    { orderId: '1542920598079-01', sellerName: 'Bruno Henrique De Sousa Lino' },
    { orderId: '1543370598680-02', sellerName: 'Vendedor não cadastrado' },
    {
      orderId: '1540970594309-02',
      sellerName: 'Lorrane Tirone Dos Santos Batista',
    },
    {
      orderId: '1542910598048-01',
      sellerName: 'Daiane Fernanda De Souza Takamori',
    },
    {
      orderId: '1542930598111-01',
      sellerName: 'Indianara Barbosa Landim Silva',
    },
    {
      orderId: '1543350598608-01',
      sellerName: 'Stephanie Gabriela Cremasco Parra',
    },
    {
      orderId: '1542630597601-01',
      sellerName: 'Luciana Lopes Rodrigues A Martins',
    },
    {
      orderId: '1542950598153-01',
      sellerName: 'Michael William Damasio Bezerra',
    },
    {
      orderId: '1543420598805-01',
      sellerName: 'Adianelys De La Caridad Barreras William',
    },
    { orderId: '1543100598253-01', sellerName: 'Bianca Salvador Quintanilha' },
    { orderId: '1543390598726-01', sellerName: 'Bruno Luiz De Oliveira' },
    { orderId: '1543370598669-01', sellerName: 'Karina Dos Santos Silva' },
    { orderId: '1542930598094-01', sellerName: 'Karina De Lima Silva' },
    {
      orderId: '1542960598167-01',
      sellerName: 'Daniel Alexandre Camargo Francisco',
    },
    {
      orderId: '1542870597943-01',
      sellerName: 'Bruna Constantino De Carvalho',
    },
    { orderId: '1542910598069-01', sellerName: 'Vendedor não cadastrado' },
    { orderId: '1542870597930-01', sellerName: 'Jaqueline Steffani Ribeiro' },
    { orderId: '1543360598635-01', sellerName: 'Vendedor não cadastrado' },
    { orderId: '1542910598074-01', sellerName: 'Ryan Mattozinho Camilo' },
    { orderId: '1543340598568-01', sellerName: 'Nazare Aparecida Dos Santos' },
    { orderId: '1542880597957-01', sellerName: 'Rodrigo Barbosa Cardoso' },
    { orderId: '1542690597768-01', sellerName: 'Gabriel Costa Da Silva' },
    { orderId: '1542910598067-01', sellerName: 'Daiane Santana Paes' },
    { orderId: '1542640597635-01', sellerName: 'Maicon Pereira' },
    {
      orderId: '1542860597924-01',
      sellerName: 'Valeria Lopes Araujo Dos Santos',
    },
    { orderId: '1542930598116-01', sellerName: 'Edson Henrique De Macena' },
    {
      orderId: '1542900598017-01',
      sellerName: 'Maria De Lourdes De Sousa Teixeira',
    },
    { orderId: '1542680597743-01', sellerName: 'Geovanna Saraiva Pinheiro' },
    {
      orderId: '1543170598399-01',
      sellerName: 'Danieli Aparecida De Lima Ribeiro',
    },
    {
      orderId: '1543340598578-01',
      sellerName: 'Wagner Victor Trindade Dos Santos',
    },
    { orderId: '1542690597759-01', sellerName: 'Bianca Salvador Quintanilha' },
    {
      orderId: '1542910598065-01',
      sellerName: 'Indianara Barbosa Landim Silva',
    },
    {
      orderId: '1543370598655-01',
      sellerName: 'Marcos Ryan Schonhals Cavalheiro',
    },
    { orderId: '1542660597704-01', sellerName: 'Janaina Fernandes Mathias' },
    { orderId: '1542850597900-01', sellerName: 'Vendedor 12 - Loja 063' },
    { orderId: '1543370598671-01', sellerName: 'Paloma Sartorato Desiderio' },
    { orderId: '1542880597978-01', sellerName: 'Rosangela Teixeira Silva' },
    { orderId: '1542910598063-01', sellerName: 'Samara Dos Santos Silva' },
    { orderId: '1543390598741-01', sellerName: 'Igor Cesar Lopes De Andrade' },
    {
      orderId: '1542920598082-01',
      sellerName: 'Rosangela Aparecida De Souza Paiva',
    },
    { orderId: '1542870597934-01', sellerName: 'Bruno Luiz De Oliveira' },
    { orderId: '1543150598346-01', sellerName: 'Lucas Carvalho' },
    {
      orderId: '1543140598337-01',
      sellerName: 'Agatha Da Silva Garcia Feldmann',
    },
    { orderId: '1542920598075-01', sellerName: 'Caua Paulo Da Silva' },
    {
      orderId: '1543360598638-01',
      sellerName: 'Rebecca Leticia De Souza Lima',
    },
    {
      orderId: '1542650597644-01',
      sellerName: 'Sandra Cristina Dos Santos Ruiz',
    },
    { orderId: '1543350598625-01', sellerName: 'Vendedor não cadastrado' },
    {
      orderId: '1543150598348-01',
      sellerName: 'Maria Alice Santos De Assuncao',
    },
    {
      orderId: '1543370598679-01',
      sellerName: 'Sandra Cristina Dos Santos Ruiz',
    },
    { orderId: '1543140598331-01', sellerName: 'Andressa Silva Simoes' },
    { orderId: '1542890598002-01', sellerName: 'Daniel Cruz' },
    { orderId: '1543120598309-01', sellerName: 'Marcelo Eneas Pinto' },
    {
      orderId: '1542960598160-01',
      sellerName: 'Danieli Aparecida De Lima Ribeiro',
    },
    {
      orderId: '1543360598640-01',
      sellerName: 'Maria Helena Alves De Souza Gallas',
    },
    {
      orderId: '1542930598102-01',
      sellerName: 'Daiane Fernanda De Souza Takamori',
    },
    { orderId: '1543400598764-01', sellerName: 'Silvia Teles Rodrigues' },
    { orderId: '1543360598644-01', sellerName: 'Gernyane Conceicao Alves' },
    { orderId: '1543160598363-01', sellerName: 'Patricia Dubal Fonseca' },
    {
      orderId: '1542930598117-01',
      sellerName: 'Felipe Daniel Dos Sanstos Dias',
    },
    {
      orderId: '1543380598694-01',
      sellerName: 'Roniclecio Francisco Desiderio Dos Santo',
    },
    { orderId: '1543130598320-01', sellerName: 'Renato De Carvalho Izaltino' },
    { orderId: '1543110598272-01', sellerName: 'Bianca Salvador Quintanilha' },
    {
      orderId: '1543340598569-01',
      sellerName: 'Maria Dayane Da Silva Feliciano',
    },
    { orderId: '1541920596021-01', sellerName: 'Isabela Braatz' },
    {
      orderId: '1543430598842-01',
      sellerName: 'Jessica Dos Santos Silva Santos',
    },
  ];

  public async employeeVerification(): Promise<void> {
    for (const obj of this.mockData) {
      const employeeId = await this.getEmployeeIdByVtexOrderId(obj.orderId);

      if (!employeeId) {
        this.logMessage(
          `❌ Seller ID não encontrado para o pedido ${obj.orderId}`
        );
        continue;
      }

      const employeeName = await this.getEmployeeInMega(employeeId);

      if (!employeeName) {
        this.logMessage(
          `❌ Funcionário ID ${employeeId} não encontrado no Mega`
        );
        continue;
      }

      const doesNameMatch =
        this.normalizeName(employeeName) === this.normalizeName(obj.sellerName);

      if (doesNameMatch) {
        this.logMessage(
          `✅ Nome confere para o pedido ${obj.orderId}: ${employeeName}`
        );
      } else {
        this.logMessage(
          `❌ Nome divergente para o pedido ${obj.orderId}: Esperado "${obj.sellerName}", Encontrado "${employeeName}"`
        );
      }
    }
  }

  private async getEmployeeIdByVtexOrderId(
    orderId: string
  ): Promise<null | number> {
    try {
      const response = await axios.get(
        `${env.VTEX_DEFAULT_URL}/api/oms/pvt/orders/${orderId}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VTEX-API-AppKey': env.VTEX_API_KEY,
            'X-VTEX-API-AppToken': env.VTEX_API_TOKEN,
          },
        }
      );

      const openTextFieldValue = response.data.openTextField?.value;

      if (!openTextFieldValue) {
        console.warn(
          `openTextField.value não encontrado para o pedido ${orderId}`
        );
        return null;
      }

      const number = openTextFieldValue.toString().replace(/\D/g, '');
      const employeeId = Number(number);

      return isNaN(employeeId) ? null : employeeId;
    } catch (error) {
      console.error(`Erro ao buscar o pedido ${orderId}:`, error);
      return null;
    }
  }

  private async getEmployeeInMega(userId: number): Promise<null | string> {
    const query = `
      SELECT NOME 
      FROM t_funcionario 
      WHERE idfuncionario = :id
    `;

    try {
      const result = await MegaAppDataSource.query(query, [userId]);
      if (result.length > 0) {
        return result[0].NOME;
      }
      return null;
    } catch (error) {
      console.error(
        `Erro ao buscar funcionário no Mega com ID ${userId}:`,
        error
      );
      return null;
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

  private normalizeName(name: string): string {
    return name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
