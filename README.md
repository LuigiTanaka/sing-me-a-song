# projeto21-sing me a song (backend)


# Descrição

Aplicação dos conceitos de testes aprendidos em aula em uma aplicação de recomendações de músicas.


# Testes realizados

## Testes de integração
-   Testa caso de sucesso POST /recommendations
-   Testa erro de conflito (409) POST /recommendations
-   Testa caso de sucesso POST /recommendations/:id/upvote
-   Testa erro de recomendação não encontrada (404) POST /recommendations/:id/upvote
-   Testa caso de sucesso POST /recommendations/:id/downvote
-   Testa se ao atingir pontuação abaixo de -5 a recomendação é excluida POST /recommendations/:id/downvote
-   Testa erro de recomendação não encontrada (404) POST /recommendations/:id/downvote
-   Testa caso de sucesso GET /recommendations
-   Testa caso de sucesso GET /recommendations/:id
-   Testa erro de recomendação não encontrada (404) GET /recommendations/:id
-   Testa sucesso GET /recommendations/random
-   Testa erro de recomendação não encontrada (404) GET /recommendations/random
-   Testa sucesso GET /recommendations/top/:amount

## Testes unitários da camada service
-   Testa função insert: caso de sucesso
-   Testa função insert: caso de recomendação duplicada
-   Testa função upvote: caso de sucesso
-   Testa função upvote: caso de id não encontrado
-   Testa função downvote: caso de sucesso
-   Testa função downvote: caso de id não encontrado
-   Testa função downvote: caso de score abaixo de -5
-   Testa função get: caso de sucesso
-   Testa função getTop: caso de sucesso
-   Testa função getRandom: caso de sucesso, random < 0.7 e há recomendação com score > 10
-   Testa função getRandom: caso de sucesso, random >= 0.7 e há recomendação com score <= 10
-   Testa função getRandom: caso de sucesso, random < 0.7 e não há recomendação com score > 10
-   Testa função getRandom: caso de sucesso, random >= 0.7 e não há recomendação com score <= 10
-   Testa função getRandom: caso de nenhuma recomendação cadatrada

</br>

## Rodar localmente

Clone o projeto

```bash
  git clone https://github.com/LuigiTanaka/sing-me-a-song-back.git
```

Vá até a pasta do projeto

```bash
  cd sing-me-a-song/
```

Instale as dependências

```bash
  npm install
```

Crie o banco de dados com o prisma

```bash
  npx prisma migrate dev
```

## Variáveis de ambiente

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu arquivo .env

`PORT = número #recomendação:5000`

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName`

`NODE_ENV = prod`

</br>

## Realizar testes
Para realizar os testes, será necessário a criação de um novo arquivo .env chamado ".env.test".

### Modificações .env.test

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName_test`

`NODE_ENV = test`

### Testes de integração

```bash
  npm run test:integration
```

### Testes unitários

```bash
  npm run test:unit
```

</br>

## Autor

-   Luigi Tanaka, a student at Driven Education 
<br/>
