# Plena

Plena é um MVP de web app em formato de chat com IA para sugestões culinárias leves, práticas e acolhedoras para mulheres na menopausa.

O app não oferece orientação médica, nutricional clínica ou tratamento. A Plena sugere receitas, substituições, cardápios simples, marmitas e listas de compras em linguagem segura.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase Auth e Postgres
- Anthropic API

## Como instalar

```bash
npm install
```

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

## Variáveis de ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=
MERCADO_PAGO_ACCESS_TOKEN=
MERCADO_PAGO_WEBHOOK_SECRET=
MERCADO_PAGO_NOTIFICATION_URL=
```

`ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `MERCADO_PAGO_ACCESS_TOKEN` e `MERCADO_PAGO_WEBHOOK_SECRET` ficam apenas no servidor. Não use essas chaves em componentes client.

## Como rodar

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Como configurar Supabase

1. Crie um projeto no Supabase.
2. Copie `Project URL` para `NEXT_PUBLIC_SUPABASE_URL`.
3. Copie a chave `anon public` para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copie a chave `service_role` para `SUPABASE_SERVICE_ROLE_KEY`.
5. Em Authentication, habilite email e senha.
6. Rode a migration em `supabase/migrations/001_initial_schema.sql`.

Com Supabase CLI:

```bash
supabase db push
```

Ou cole o SQL no editor SQL do painel do Supabase.

## Como testar o chat

1. Configure as variáveis de ambiente.
2. Rode `npm run dev`.
3. Crie uma conta ou entre em `/login`.
4. Abra `/chat`.
5. Teste mensagens como:
   - `Tenho frango, arroz e abobrinha. O que posso fazer?`
   - `Quero uma janta leve e rápida.`
   - `Não posso usar leite. Troca essa receita.`

O chat exige login para contabilizar o limite mensal. Cada conta tem 120 mensagens da Plena por mês; o uso aparece no topo do chat.

## Rotas

- `/` landing page
- `/chat` chat com IA
- `/conversas` histórico de conversas
- `/favoritas` receitas salvas
- `/premium` planos
- `/login` login e cadastro

## Segurança e posicionamento

A Plena deve permanecer como assistente culinária e informativa. Evite promessas de emagrecimento, cura, tratamento, controle hormonal ou melhora de sintomas.

Mensagem base de segurança:

> Plena oferece sugestões culinárias informativas. Para orientação alimentar individualizada, procure um nutricionista ou médico.

Pedidos sobre sintomas, hormônios, diabetes, colesterol, pressão alta, ansiedade, insônia ou outras condições devem receber resposta cuidadosa, com receitas leves e orientação para buscar profissional qualificado.

## Funcionalidades do MVP

- Landing page responsiva
- Chat mobile-first com sugestões rápidas
- API `/api/chat` com Anthropic
- Salvamento de conversas e mensagens no Supabase quando autenticada
- Histórico de conversas
- Remoção de conversas
- Favoritar respostas de receita
- Copiar respostas
- Login, cadastro e logout
- Checkout real com Mercado Pago
- Página premium com planos mensal de R$ 34,99 e anual de R$ 352
- Limite mensal de 120 mensagens da Plena por conta
- Migrations SQL com RLS
