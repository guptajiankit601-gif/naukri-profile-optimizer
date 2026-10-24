# 02 Architecture — Naukri Profile Optimizer

**Style:** Next.js monolith (App Router) + route handlers + serverless Postgres
**Deployable Unit:** Single Vercel Edge / Node.js deployment

## Layers
1. **Presentation / UI Layer:** Next.js App Router (`app/`), Tailwind CSS v4 Sunset palette, shadcn/ui inspired accessible primitives.
2. **API Layer:** Type-safe Route Handlers (`app/api/*`) with Zod request schemas.
3. **Domain Layer:** Pure TypeScript modules with zero I/O (`lib/parser/`, `lib/scoring/`, `lib/rewriter/`, `lib/jobfit/`, `lib/planner/`).
4. **Data & AI Layer:** Supabase Postgres, Drizzle ORM, Google Gemini 2.0 Flash (with deterministic fallback).
