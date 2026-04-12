# Verdantis App

Aplicativo mobile (React Native + Expo) para gestão de fazenda, acompanhamento de lotes/cultivos e visualização de indicadores de rentabilidade, com foco em **controle operacional** e **rastreabilidade**.

> Este repositório contém apenas o app. Ele consome uma API (backend) rodando por padrão na porta **8080**.

## Funcionalidades

- **Autenticação**
  - Login e cadastro de produtor.
  - Persistência de sessão (token e usuário) via armazenamento local.

- **Dashboard (Home)**
  - KPIs: lucro total, receita, custo, cultura mais rentável e lote mais rentável.
  - Gráficos: lucro por lote, tendência de lucro por cultura e lucro por cultura.

- **Lotes**
  - Listagem de lotes e visualização de detalhes.
  - Criação de lote com *preview* de receita/lucro/margem.
  - Exclusão de lote.

- **Cultivos + Rastreabilidade**
  - Lista de cultivos derivada dos lotes.
  - Timeline de eventos de rastreabilidade por lote.
  - Registro de eventos e finalização do cultivo.
  - Exportação da lista de rastreabilidade:
    - **PDF** (via `expo-print`, quando disponível)
    - **QR Code** (gera um link de QR para o payload dos eventos)

- **Analytics**
  - Cotação de culturas e cards de mercado.
  - Gráficos comparativos (lucro por cultura e tendência de lucro).

- **Perfil**
  - Dados básicos do usuário e detalhes via API.
  - Ações de logout.
  - (Área de gestor) botões para gerar **QR** e **PDF** do perfil.

## Stack

- **Expo** (~54) + **Expo Router**
- **React Native** (0.81) + **TypeScript**
- **Axios** para chamadas HTTP
- UI com componentes reutilizáveis em `components/`

## Pré-requisitos

- Node.js (LTS recomendado)
- NPM (ou Yarn/Pnpm)
- Para rodar em Android:
  - Android Studio + SDK configurado (emulador ou dispositivo)

## Configuração da API (backend)

O app espera a API em `http://<host>:8080`.

- **Android Emulator**: normalmente o host do seu PC é `10.0.2.2`
- **iOS Simulator**: normalmente `localhost`
- **Dispositivo físico**: use o IP da sua máquina na rede (ex: `192.168.0.10`)

A resolução do host é centralizada em:

- `api/config.ts` (função `getApiBaseUrl()`)

Se você estiver em dispositivo físico e o app não conseguir derivar o host automaticamente, ajuste a constante:

- `MANUAL_DEV_MACHINE_HOST` em `api/config.ts`

## Como executar localmente

### 1) Instalar dependências

```bash
npm install
```

### 2) Rodar o app

#### Opção A — modo dev (recomendado para começar)

```bash
npm run start
```

- Abra no **Android**/**iOS** via QR Code (Expo) ou selecione o alvo pelo menu do Expo.
- Para rodar no navegador:

```bash
npm run web
```

#### Opção B — build de desenvolvimento (quando usar módulos nativos)

Se você encontrar erros do tipo “native module not found” (comuns quando o projeto usa plugins/módulos nativos), gere/rode um dev build:

```bash
npm run android
# ou
npm run ios
```

> Observação: `expo run:*` exige ambiente nativo configurado (Android Studio/Xcode).

## Comandos úteis

- `npm run start` — inicia o Metro/Expo
- `npm run android` — roda no Android com dev build
- `npm run ios` — roda no iOS com dev build
- `npm run web` — roda no navegador

## Estrutura do projeto (resumo)

- `app/` — rotas/telas (Expo Router)
- `api/` — client HTTP e endpoints (auth, dashboard, lotes, analytics, users)
- `context/` — contexto de autenticação
- `components/` — componentes de UI e rastreabilidade
- `types/` — tipos de domínio

## Problemas comuns

- **Loading infinito / falha ao logar / listas vazias**: geralmente é **API fora do ar** ou URL incorreta.
  - Confirme que o backend está rodando em `:8080`.
  - Ajuste o host em `api/config.ts` (especialmente em dispositivo físico).

Se existir documentação adicional no repositório, consulte `TROUBLESHOOTING.md`.
