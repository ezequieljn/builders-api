## Projeto Backend com Node.js - Builders

Este projeto é composto por um backend desenvolvido em **Node.js**, que tem como objetivo verificar boletos vencidos e calcular os juros a serem cobrados, levando em consideração o valor do boleto e a quantidade de dias em atraso.

### Sobre

O projeto foi construído seguindo algumas boas práticas, como **Clean Architecture**, visando o desacoplamento e a criação de testes, como testes de unidade, testes de integração e testes E2E.

A cobertura de testes está acima de **90%** e pode ser verificada por meio do comando.

```bash
npm run test -- --coverage
```

### Pré-requisitos

Antes de executar o projeto, é necessário ter o Docker instalados na máquina.

### Instalação

1. Clone o repositório:

```shell
git https://github.com/ezequieljn/builders-api
```

2. Inicie o container:

```bash
cd builders-api

docker compose up -d
```

- Caso tenha algum problema com permissão do .docker/entrypoint.sh fornessa permissão como o comando

```bash
chmod +x ./.docker/entrypoint.sh
```

### Utilização

O projeto estará disponível em `http://localhost:3030` localmente.

O projeto também pode ser testado em `https://builders.dok3s.srobot.dev`, que está hospedado em um servidor K8s.

##### Rotas HTTP

A seguir, são listadas todas as rotas HTTP disponíveis neste projeto:

- **POST /payment-slip**

Essa rota tem como objetivo realizar a consulta de um boleto e, caso esteja atrasado, calcular os juros devidos com base na multa por atraso e na multa diária.

**Exemplo de parametros**

```json
{
  "bar_code": "34191790010104351004791020150008191070069000",
  "payment_date": "2023-01-01"
}
```

Exemplo de **bar code**

```json
{
  "Code1": "34191790010104351004791020150008291070026000",
  "Code2": "34191790010104351004791020150008191070069000",
  "Code3": "34199800020104352008771020110004191070010000",
  "Code4": "34197650070104357008271020110004991070040000"
}
```

**Exemplo de resposta**

```json
{
  "original_amount": 690,
  "amount": 737.61,
  "due_date": "2022-08-07",
  "payment_date": "2023-01-01",
  "interest_amount_calculated": 6.9,
  "fine_amount_calculated": 47.61
}
```

- **GET /payment-slip**

Essa rota tem como objetivo retornar todos os boletos que foram calculados anteriormente.

**Exemplo de resposta**

```json
[
  {
    "original_amount": 690,
    "amount": 712.31,
    "due_date": "2022-08-07",
    "payment_date": "2022-09-13",
    "interest_amount_calculated": 3.23,
    "fine_amount_calculated": 22.31
  }
]
```
