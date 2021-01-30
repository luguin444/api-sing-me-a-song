# Sing Me A Song

Já pediu para alguém alguma recomendação de música? Sing me a song é uma API para recomendação anômina de músicas. Quanto mais as pessoas curtirem uma recomendação, maior a chance dela ser recomendada para outras pessoas 🙂

## Features

✅ Adicionar gêneros musicais

✅ Enviar nova uma música com nome, link do YouTube e gênero

✅ Pegar uma recomendação aleatório de música

✅ Aprovar ou desaprovar uma recomendação dada. Quanto mais aprovada uma música, maior a chance dela ser recomendada. Músicas desaprovadas são removidas.

## O que é a API?

A API do Sing Me A Song é composta pelas seguintes rotas:

- **POST `/genres`**

    Cria novo gênero com nome dado se não existir. Espera Json no formato

    ```json
    {
      "name": "Arrocha"
    }
    ```

- **GET `/genres`**

    Retorna lista de gêneros existentes no formato abaixo em ordem alfabética.

    ```json
    [
    	{
    		"id": 1,
    		"name": "Arrocha"
    	},
    	{
    		"id": 32
    		"name": "Forró",
    	},
    	{
    		"id": 23
    		"name": "Metal progressivo",
    	},
    ]
    ```

- **POST `/recommendations`**

    Adiciona uma nova recomendação de música. A requisição deve ter o seguinte formato:

    ```json
    {
    	"name": "Falamansa - Xote dos Milagres",
    	"genresIds": [32, 23]
    	"youtubeLink": "[https://www.youtube.com/watch?v=chwyjJbcs1Y](https://www.youtube.com/watch?v=chwyjJbcs1Y&ab_channel=Deck)",
    }
    ```

    - Validação
        - `name` é uma string obrigatória
        - `genresIds` é uma array com pelo menos 1 id válido de gênero
        - `youtubeLink` deve ser um link do youtube
- **POST `/recommendations/:id/upvote`**

    Adiciona um ponto à pontuação da recomendação. Não espera nada no corpo.

- **POST `/recommendations/:id/downvote`**

    Remove um ponto da pontuação da recomendação. Não espera nada no corpo. Se a pontuação fica abaixo de -5, a recomendação deve ser excluída.

- **GET `/recommendations/random`**

    Pega uma recomendação aleatória, baseada na seguinte lógica:

    - **70% das vezes**: uma música com pontuação maior que 10 deve ser recomendada aleatoriamente
    - **30% das vezes**: uma música com pontuação entre -5 e 10 (inclusive), deve ser recomendada aleatoriamente
    - Caso não haja músicas dentro de alguma categoria acima, deve ser sorteada uma música qualquer independente da pontuação
    - Caso não haja músicas cadastradas, deve ser retornado status 404

    A resposta deve ter o formato:

    ```json
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"genres": [
    		{
    			"id": 32
    			"name": "Forró",
    		},
    		{
    			"id": 23
    			"name": "Metal progressivo",
    		}
    	],
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```

- **GET `/recommendations/genres/:id/random`**

    Recomenda uma música aleatória de determinado gênero, seguindo a lógica anterior.

    A resposta deve ter o formato:

    ```json
    {
    	"id": 1,
    	"name": "Chitãozinho E Xororó - Evidências",
    	"genres": [
    		{
    			"id": 32
    			"name": "Forró",
    		},
    		{
    			"id": 23
    			"name": "Metal progressivo",
    		}
    	],
    	"youtubeLink": "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO",
    	"score": 245
    },
    ```

## Como rodar o projeto?

1. Instale o NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
2. Instale o Postgres 13 [https://www.postgresql.org/](https://www.postgresql.org/)
3. Crie uma nova database

    ```bash
    $ psql
    $ CREATE DATABASE minha_nova_database;
    ```

4. Clone o projeto
5. Crie o arquivo .env a partir do arquivo .env.example e preencha os valores com a url para a database criada e a porta a ser usada.
6. Instale as dependências

    ```bash
    npm i
    ```

7. Rode as migrations

    ```bash
    npx sequilize-cli db:migrate
    ```

8. Rode a aplicação 🙂

    ```bash
    npm run dev
    ```
