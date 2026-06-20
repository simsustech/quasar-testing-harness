# Quasar Testing Harness

> **⚠ AI-Generated Project Disclaimer**
> This project was generated with the assistance of AI. While functional, it
> should be reviewed by a human before being used in production.

A multi-page Vitrify application where every Quasar UI component has its own
dedicated route, with props reactively driven by URL query strings and an
on-page control panel. Optimized for **automated testing (Playwright)** and
**Visual AI regression analysis** — not for prettiness.

## Monorepo Layout

```
quasar-testing-harness/
├── packages/
│   ├── app/        # Frontend SPA (Vue 3 + Quasar + Vitrify) - the playground
│   ├── api/        # Fastify SSR server (placeholder, future)
│   └── tools/      # Shared types/utilities (placeholder, future)
├── pnpm-workspace.yaml
└── package.json
```

## Quick Start

```bash
pnpm install
pnpm dev          # CSR dev server
# Open http://localhost:3000/
# Navigate to http://localhost:3000/q-btn?label=Hello&color=primary&loading=true
```

## Build

```bash
pnpm build:app:csr    # Client-side only
pnpm build:app:ssr    # Server-side rendering (needs packages/api later)
pnpm build:app:ssg    # Static site generation
```

## Reference Architecture

`~/Projects/petboarding/` is the architectural reference for Vitrify/Quasar
configuration. See `PLAN.md` for the full design and progress tracker.
