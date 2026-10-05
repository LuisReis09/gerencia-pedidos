# Pulse Commerce

Aplicação fullstack para gerenciamento de produtos, custos, pedidos e dashboard financeiro, usando persistência em memória.

## Stack

Backend: NestJS, TypeScript, class-validator e Jest. Frontend: React, TypeScript e Vite.

## Como executar

```bash
cd backend
npm install
npm run start:dev
```

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

Backend: `http://localhost:4000/api`. Frontend: `http://localhost:5173`.

## Testes e builds

```bash
cd backend && npm test && npm run lint && npm run build
cd frontend && npm run build
```

## Fluxo principal

Cadastre produtos, informe custos, receba pedidos em `POST /api/webhooks/orders` e consulte pedidos, custos e indicadores em `/api/orders`, `/api/products/costs` e `/api/dashboard`. Dashboard e pedidos aceitam `productIds=P-001,P-002`; o dashboard também retorna a série diária em `series`.
