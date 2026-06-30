# Quasar Testing Harness

A multi-page Vitrify application where every Quasar UI component has its own
dedicated route, with props reactively driven by URL query strings and an
on-page control panel. Designed for **automated visual regression testing**
with Playwright.

## Monorepo Layout

```
quasar-testing-harness/
├── packages/
│   ├── app/        # Frontend SPA (Vue 3 + Quasar + Vitrify) — the playground
│   └── tools/      # Page/props/screenshot manifest generators
├── tests/
│   ├── responsive.spec.ts          # Default screenshots at every viewport × style
│   ├── responsive-variants.spec.ts # Prop variant screenshots at md + lg
│   ├── functional.spec.ts          # Interactive behavior tests
│   └── helpers.ts                  # Screenshot path/device utilities
└── screenshots/ → packages/app/public/screenshots/
```

## Quick Start

```bash
pnpm install
pnpm dev          # CSR dev server at http://localhost:3000/
```

## Generate Screenshots

Screenshots are saved to `packages/app/public/screenshots/<style>/<device>/<component>/`.

```bash
# Default screenshots (all 73 components × 3 styles × 4 viewports)
npx playwright test tests/responsive.spec.ts

# Prop variant screenshots (23 components with variants at md + lg)
npx playwright test tests/responsive-variants.spec.ts

# Both
npx playwright test tests/responsive.spec.ts tests/responsive-variants.spec.ts
```

The dev server auto-starts via Playwright's `webServer` config. Reuse the
existing server with `reuseExistingServer: true` for faster iterations.

## Test Layout

| Test file | What it covers |
|---|---|
| `responsive.spec.ts` | Every component at its default state across `sm` (375×667), `md` (768×1024), `lg` (1440×900) and 3 styles (md3, md2, unstyled) |
| `responsive-variants.spec.ts` | Prop variants (filled/outlined/dense/etc.) for 23 components at `md` and `lg` |
| `functional.spec.ts` | Interactive behavior — clicks, toggles, URL state sync |
| `composites.spec.ts` | Composite page with multiple components interacting |

## Build

```bash
pnpm build:app:csr    # Client-side only
pnpm build:app:ssr    # Server-side rendering
pnpm build:app:ssg    # Static site generation
```
