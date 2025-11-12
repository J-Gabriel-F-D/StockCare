# StockCare

**StockCare** — sistema de gerenciamento de estoque de insumos médicos (backend em Node.js/TypeScript + Prisma; frontend em React).  
Este repositório contém dois subprojetos: `backend` e `frontend`.

> Este projeto faz parte do Trabalho de Conclusão de Curso (TCC).  
> Link do trabalho: https://repositorio.ifpb.edu.br/handle/177683/4715.

---

# Índice
- [Visão Geral](#visão-geral)
- [Como rodar o projeto](#como-rodar-o-projeto)
  - [Pré-requisitos](#pré-requisitos)
  - [Rodando com Docker (recomendado)](#rodando-com-docker-recomendado)
  - [Rodando local (sem Docker)](#rodando-local-sem-docker)
- [Backend](#backend)
  - [Stack e arquivos principais](#stack-e-arquivos-principais)
  - [Modelos (Prisma)](#modelos-prisma)
  - [Principais funcionalidades / controllers](#principais-funcionalidades--controllers)
  - [Rotas e documentação (Swagger)](#rotas-e-documentação-swagger)
  - [Exportação de relatórios (XLSX / PDF)](#exportação-de-relatórios-xlsx--pdf)
- [Frontend](#frontend)
  - [Stack e estrutura](#stack-e-estrutura)
  - [Principais páginas / componentes](#principais-páginas--componentes)
- [Variáveis de ambiente importantes](#variáveis-de-ambiente-importantes)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

# Visão geral
StockCare é um sistema para controle de insumos médicos, com funcionalidades de:
- cadastro e gestão de fornecedores e insumos;
- registro de entradas e saídas (com usuário responsável);
- relatórios e exportação em XLSX e PDF;
- alertas de validade de insumos;
- pedidos de compra (integração simulada);
- autenticação via JWT e controle de acesso básico.

---

# Como rodar o projeto

## Pré-requisitos
- Docker & docker-compose (recomendado) **ou** Node.js >= 18 + npm/yarn;
- PostgreSQL (se rodando sem Docker);
- `DATABASE_URL` configurada (ver seção variáveis de ambiente).

## Rodando com Docker (recomendado)
O repositório já contém um `docker-compose.yml` que sobe:
- um banco Postgres;
- o backend;
- o frontend (Vite).  

Comando:
```bash
docker-compose up --build
```
Isso criará e iniciará os serviços e deixará:
- backend: `http://localhost:3000`
- frontend: `http://localhost:5173`

## Rodando local (sem Docker)

### Backend
1. Entre na pasta `backend`:
```bash
cd backend
```
2. Instale dependências:
```bash
npm install
```
3. Crie/atualize o banco de dados e gere client Prisma:
```bash
# ajustar DATABASE_URL no .env antes
npx prisma generate
# se usar migrations
npx prisma migrate dev --name init
```
4. Rodar em modo dev:
```bash
npm run dev
```
O backend expõe a API em `http://localhost:3000` por padrão (ver `PORT`).

### Frontend
1. Entre na pasta `frontend`:
```bash
cd frontend
```
2. Instale dependências:
```bash
npm install
```
3. Execute:
```bash
npm run dev
```
O frontend ficará tipicamente em `http://localhost:5173`.

---

# Backend

## Stack
- Node.js + TypeScript
- Express (v5)
- Prisma (Postgres)
- ExcelJS / PDFKit (exportação)
- JWT para autenticação
- bcrypt para senhas
- Swagger (documentação)

## Modelos (Prisma)
Principais models (resumo):
- **Fornecedor**: `id`, `nome`, `cnpj`, `telefone`, `email`, `criadoEm`
- **Insumo**: `id`, `nome`, `descricao`, `unidadeMedida`, `precoUnitario`, `quantidadeMinima`, `codigoBarras`, `fornecedorId`
- **Usuario**: `id`, `nome`, `cpf`, `email`, `senha`, `matricula`
- **Entrada** e **Saida**: registram movimentações
- **PedidoCompra**: solicitações de compra (status: `PENDENTE|ENVIADO|RECEBIDO`)

## Principais funcionalidades / controllers
- **AuthController** — login JWT
- **UsuariosController** — CRUD de usuários
- **FornecedoresController** — CRUD de fornecedores
- **InsumosController** — CRUD de insumos
- **EntradasController / SaidasController** — movimentações com validação de estoque
- **RelatoriosController** — geração de relatórios XLSX e PDF
- **AlertasController** — alertas de validade
- **ComprasController** — pedidos de compra simulados

## Documentação da API
Swagger disponível em `/api-docs` se habilitado.

## Scripts úteis
- `npm run dev`
- `npx prisma generate`
- `npx prisma migrate dev --name init`

---

# Frontend

## Stack
- React + TypeScript + Vite
- Axios
- Context API para autenticação
- Componentes reutilizáveis (Card, Header, Sidebar, etc.)

## Estrutura
- `src/components` — componentes UI
- `src/pages` — páginas principais
- `src/services` — integração com API
- `src/context/AuthContext.tsx` — autenticação

## Autenticação
`AuthContext` salva token em cookie (`js-cookie`) e fornece controle de login/logout.

---

# Variáveis de ambiente

Backend:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/stockcare
PORT=3000
JWT_SECRET=seusegredoaqui
```

Frontend:
```
VITE_API_URL=http://localhost:3000
```

---

# Contribuição
1. Fork e clone o repositório
2. Crie branch `feature/minha-feature`
3. Commit e PR para `main`

---

# Licença
MIT
