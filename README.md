# Kickops Academy Landings

Landings públicas de marketing e conversão da Kickops Academy, braço educacional da Kickops. Hoje o foco é landing; o projeto pode evoluir para o site da Kickops Academy.

## Stack

- Next.js (App Router) + React
- TypeScript
- Tailwind CSS
- shadcn/ui

## Pré-requisitos

- Node.js (compatível com Next.js 16)
- npm (o repositório usa `package-lock.json`)

## Setup

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint com correção automática |

## Estrutura

```txt
src/
  app/        # rotas e composição (App Router)
  assets/     # estáticos, dados e estilos globais
  core/       # técnico compartilhado (sem regra de produto)
  features/   # produto e domínio
  shadcn/     # base imutável do shadcn/ui
```

Aliases TypeScript: `@app/*`, `@assets/*`, `@core/*`, `@features/*`, `@shadcn/*`.

Regras de ouro:

- páginas e layouts em `app` ficam finos;
- domínio vive em `features`;
- não editar `src/shadcn/*` (wrappers em `core/components`).

## Documentação

- [AGENTS.md](AGENTS.md) — arquitetura e workflow para agentes
- [CONTEXT.md](CONTEXT.md) — glossário de domínio
