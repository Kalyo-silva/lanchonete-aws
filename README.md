# 🍔 Sistema de Lanchonete - Módulo Cardápio & Front-end

Este repositório contém a interface do usuário (**Front-end**) e o serviço de gerenciamento de cardápio (**Back-end**) da aplicação de lanchonete.

A arquitetura foi desenhada seguindo o modelo híbrido: **containers no Kubernetes** para o cardápio e arquitetura **Serverless (Lambda/SQS)** para o processamento de pedidos.

---

# 🏗️ Arquitetura do Sistema

O sistema está dividido de forma que o Back-end em Node.js gerencie apenas o cardápio (conectado ao Amazon RDS), liberando o fluxo de pedidos para ser **100% Serverless**.

### Front-end

* HTML5
* CSS3
* JavaScript Puro

Consome as rotas do Back-end local/Kubernetes e as rotas disponibilizadas pelo API Gateway.

### Back-end

* Node.js
* Express
* PG Pool

Executado em ambiente containerizado utilizando Docker.

### Banco de Dados

* PostgreSQL
* Amazon RDS hospedado na AWS Academy

---

# 🚀 Como Rodar o Projeto Localmente

Para rodar o Front-end e o Back-end na sua máquina local conectando diretamente com o banco de dados PostgreSQL da AWS Academy, siga os passos abaixo.

## 1. Pré-requisitos

* Ter o Docker instalado na máquina.
* Estar em uma rede que não bloqueie conexões de saída na porta **5432**.

  * Redes corporativas ou universitárias podem bloquear essa porta.

---

## 2. Clonar e Acessar a Pasta do Back-end

```bash
cd lanchonete/backend
```

---

## 3. Construir a Imagem Docker

Sempre que o código do `server.js` for alterado, reconstrua a imagem:

```bash
docker build -t backend .
```

---

## 4. Executar o Container (Conectando ao RDS da AWS)

Execute o comando abaixo em uma única linha no terminal (PowerShell, Bash ou CMD):

```bash
docker run -p 3000:3000 -e DB_HOST="database-1.cjcmyk24xwc3.us-east-1.rds.amazonaws.com" -e DB_USER="postgres" -e DB_PASSWORD="lanchonete" -e DB_NAME="postgres" backend
```

### 💡 O que este comando faz?

* Inicia a API na porta **3000** do localhost.
* Injeta as credenciais necessárias para conexão com o banco na AWS.
* Ao iniciar, o script do banco:

  * Cria as tabelas automaticamente (caso não existam).
  * Insere os lanches de teste automaticamente (caso ainda não estejam cadastrados).

---

## 5. Abrir o Front-end

Após o container do Back-end estar rodando com sucesso:

1. Vá até a pasta `frontend`.
2. Abra o arquivo `index.html` diretamente no navegador.

O cardápio será carregado automaticamente utilizando os dados reais armazenados no banco PostgreSQL da AWS.

---

# 📂 Estrutura do Projeto

lanchonete/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── ...
│
└── README.md
```

---

# ☁️ Tecnologias Utilizadas

* Node.js
* Express
* PostgreSQL
* Amazon RDS
* Docker
* Kubernetes
* AWS Lambda
* Amazon SQS
* Amazon API Gateway
* HTML5
* CSS3
* JavaScript

---

# 👥 Equipe

Projeto desenvolvido para a disciplina/projeto de computação em nuvem utilizando serviços AWS e arquitetura híbrida baseada em containers e Serverless.
