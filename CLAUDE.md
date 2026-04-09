# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint check

npm run db:generate  # Generate Drizzle migration files from schema changes
npm run db:migrate   # Apply migrations to the database
npm run db:studio    # Open Drizzle Studio (visual DB browser)
```

## Environment

Requires `.env.local` with:
```
DATABASE_URL=postgresql://...  # Supabase PostgreSQL pooler connection string
```

## Architecture

**Next.js App Router** lead capture form for Korean users. Single-feature app:

- `app/page.tsx` — Client component. The lead form UI with phone number auto-formatting and a success confirmation screen shown after submission.
- `app/api/leads/route.ts` — POST handler. Validates name/phone/email fields and writes to PostgreSQL via Drizzle.
- `db/schema.ts` — Drizzle schema defining the `leads` table (id, name, phone, email, createdAt).
- `db/index.ts` — Initializes the Drizzle client using `DATABASE_URL`.
- `db/migrations/` — Auto-generated SQL migration files (do not edit manually).

**Data flow:** Form submit → `POST /api/leads` → Drizzle ORM → Supabase PostgreSQL

When changing the DB schema, always run `db:generate` then `db:migrate`.

## DB Schema

```ts
// db/schema.ts
leads table:
  id        serial          PK
  name      varchar(100)    NOT NULL
  phone     varchar(20)     NOT NULL
  email     varchar(255)    NOT NULL
  createdAt timestamp       DEFAULT NOW() NOT NULL
```
