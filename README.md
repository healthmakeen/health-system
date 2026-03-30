# health-system

Production-ready MVP health follow-up system built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- Supabase Auth + Postgres
- Locale routing for `en`, `ar`, `tr`
- RTL support for Arabic

## Environment

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

An `.env.example` file is included. For this workspace, `.env.local` has already been prepared with the Supabase values provided during setup.

## Local Run

```bash
npm install
npm run dev
```

Open:

```bash
http://localhost:3000
```

The app redirects to `/en` by default.

## Supabase

Supabase project files are in [supabase](/Users/aminmasri/Documents/Documents - Muna’s MacBook Air/makeenHealth/supabase).

Main migration:

- [supabase/migrations/20260330045500_initial_schema.sql](/Users/aminmasri/Documents/Documents - Muna’s MacBook Air/makeenHealth/supabase/migrations/20260330045500_initial_schema.sql)

To link this folder to the hosted Supabase project:

```bash
supabase link --project-ref jdmzcetwojzhxoteaadn
```

To push the schema:

```bash
supabase db push
```

If Supabase asks for a database password during link or push, use the database password from the hosted project settings.

## Structure

- `app` for locale routes and pages
- `components` for reusable UI
- `lib` for Supabase, locale, validation, and shared logic
- `messages` for translations
- `types` for app and database types
- `supabase` for migrations and CLI config

## V1 Features

- Email/password signup and login
- Protected routes
- First-time patient setup
- Mobile-first dashboard
- Add, edit, view, and delete daily entries
- Centralized overall status logic
- RLS-protected Supabase tables
