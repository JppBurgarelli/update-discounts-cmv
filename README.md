**Antes de tudo, é importante que você observe como módulos atuais foram construídos
antes de começar a construir um novo módulo ou serviço. Tente manter a padronização existente

# Guia de estilo de código e arquitetura do backend


## Projeto

Essa seção lida com a estrutura do projeto e como ele está organizado.

### Padrões de nomenclatura de arquivos

Utilizamos o padrão `kebab-case` para a criação de arquivos e pastas.
As pastas e arquivos devem ser criados seguindo a seguinte estrutura de nomenclatura:
`[palavra]-[segunda-palavra]-[terceira-palavra].[extensão]`

### Estrutura Principal

```
/.github - Arquivos de configuração do GitHub
/src - Código fonte do projeto
  /db - Arquivos de configuração do ORM ou Query builder utilizado
  /config - Arquivos de Configurações do projeto
  /controllers - Arquivos que intermediam a comunicação dos serviços com as rotas do express.
  /services - Arquivos que executam a lógica principal do nosso serviço.
  /routes - Arquivos de configuração das rotas expostas pelo módulo.
  /shared - Arquivos compartilhados entre os módulos
    /errors - Classes de erros personalizadas
    /infra - Arquivos de código reutilizados entre os módulos
    /protocols - Interfaces comuns reutilizadas entre os módulos
```

#### Serviços

Os serviços são responsáveis por executar a lógica principal do nosso serviço.

`[nome do módulo]-[serviço ou metodo]-service.ts`

`[nome do módulo]-[serviço ou metodo]-service.test.ts`

Os serviços devem implementar a interface `Service` contida em `src/shared/protocols/service.ts` e
terem os seus generics resolvidos para as interfaces de entrada e saída definidos dentro da pasta models de cada módulo.

_Use o mesmo padrão de nomenclatura para definir essas interfaces._

#### Controllers

Os controllers são responsáveis por intermediar a comunicação entre os serviços e as rotas.
Eles também são responsáveis por executar as lógicas de validação e fazer o tratamento dos dados recebidos.

`[nome do módulo]-controller.ts`

Os controladores devem implementar a interface `Controller` contida em `src/shared/protocols/controller.ts` e
receber os serviços e validadores necessários para o seu funcionamento via construtor.

#### Repositories

Os repositories são responsáveis por intermediar a comunicação entre os serviços e outros serviços como, por exemplo,
o banco de dados ou um serviço de terceiros.

`/[nome do módulo]-repository/[nome do módulo]-repository.ts`

`/[nome do módulo]-repository/[nome do módulo]-repository.test.ts`

Os repositórios fazem o intermédio entre os nossos serviços e outras camadas e funcionalidades da nossa aplicação.
Portanto, devem ser injetados nos serviços via construtor e mocados nos testes.

Se algum repositório for utilizado por mais de um serviço ou middleware, ele deve ser movido para a
pasta `src/shared/infra/repositories` seguindo o mesmo padrão de nomenclatura.

#### Routes

A pasta de rotas é responsável por configurar cada uma das rotas expostas pelo módulo,
além de instanciar e injetar os serviços e módulos necessários para tudo funcione.

`[nome do módulo]-routes.ts`

### CI/CD

A automação é configurada para o ambiente de produção (branch main) e ambiente de homologação (branch develop)
O arquivo de configuração deve ser editado de acordo com o projeto a ser criado

### Observabilidade

A rota /healthcheck está configurada para checagens de disponibilidade.
O Agente de APM está instalado e deve ser configurado através de variáveis de ambiente:

`ELASTIC_APM_SERVICE_NAME=Application-name`
`ELASTIC_APM_SERVER_URL=` (internal: http://srv-elastic-01.oscar:8200 | external: https://apm-server.grupooscar.com.br)
`NODE_ENV=development` (local | production | development)
