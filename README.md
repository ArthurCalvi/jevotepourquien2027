# Je vote pour qui en 2027 ?

React + Vite web app for comparing a user's policy preferences against major French party profiles ahead of the 2027 election cycle.

## What the app does

- asks 20 policy questions across Europe, institutions, economy, ecology, society and international affairs
- ranks major French party profiles by programmatic proximity
- shows per-theme scores instead of only one opaque total
- documents the source corpus and the methodological assumptions in the UI

## Important assumption

As of `2026-03-08`, comparable 2027 presidential manifestos do not yet exist.
The current version therefore codes party or bloc profiles from the latest official materials available, mainly 2024-2026 documents.

## Stack

- React 19
- TypeScript
- Vite 7
- Vercel serverless functions for anonymous result writes and aggregate reads
- a private Postgres-backed results store for storage and aggregate queries

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Anonymous results pipeline

The frontend stays on Vite. Deployment is handled by Vercel with two same-origin API routes:

- `POST /api/results/view` tracks that a completed result screen was reached for an anonymous run
- `POST /api/results/save` validates and stores an anonymized snapshot of the current result
- `GET /api/results/summary` returns aggregate trends for the results page

The private results store is only accessed from the Vercel backend. The browser never receives a write secret.
The aggregate summary also exposes the share of completed result screens that were actually saved.

## Environment variables

Copy `.env.example` and set:

- `RESULTS_STORE_URL`
- `RESULTS_STORE_SECRET`
- `RATE_LIMIT_SALT`
- `ALLOWED_ORIGINS` (optional, mainly useful for local cross-origin development)

## Database migration

The SQL migration lives in `database/migrations/20260315_anonymous_results.sql`.

## Refresh the source corpus

```bash
npm run fetch:sources
```

This downloads the referenced HTML and PDF materials into `research/raw/`.

## Methodology notes

- `research/methodology.md` explains the framing choices and limits.
- `src/data/content.ts` contains the coded party positions, question set and source catalog.
- `src/lib/scoring.ts` contains the matching algorithm.

## Current product stance

This is a proximity comparator, not an automated voting recommendation engine.
The app intentionally avoids runtime LLM scoring or dynamic question generation, because both make political bias harder to audit.
