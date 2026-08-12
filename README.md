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
│   ├── responsive.spec.ts          # Default screenshots at every viewport × style (576)
│   ├── responsive-variants.spec.ts # Prop variant screenshots at md + lg (100)
│   ├── composites.spec.ts          # 29 composite patterns × 3 styles (87)
│   ├── missing-css-classes.spec.ts # Quasar runtime classes missing from the preset (70)
│   ├── investigate.spec.ts         # Core component routes render across styles (18)
│   ├── comprehensive-tokens.spec.ts# Computed CSS variables/colors across styles (9)
│   ├── functional.spec.ts          # Interactive behavior tests (9)
│   ├── review.spec.ts              # /review gallery page (6)
│   ├── style-switcher.spec.ts      # Body-class style switching (5)
│   ├── unstyled.spec.ts            # Unstyled style isolation (4)
│   ├── ssr.spec.ts                 # SSR dev server smoke tests (2)
│   ├── debug-css-check.spec.ts     # Debug CSS helper (1)
│   ├── components/                 # 73 per-component spec files (393 tests)
│   └── helpers.ts                  # shot()/computedRgba()/dumpDiagnostics() utilities
└── screenshots/ → packages/app/public/screenshots/

## Quick Start

```bash
pnpm install
pnpm dev          # CSR dev server at http://localhost:3000/
```

## Generate Screenshots

Screenshots are saved to `packages/app/public/screenshots/<style>/<device>/<component>/`.

```bash
# Default screenshots (all 73 components × 3 styles × 3 viewports)
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
| --- | --- |
| `responsive.spec.ts` | Every component at its default state across `sm` (375×667), `md` (768×1024), `lg` (1440×900) and 3 styles (md3, md2, unstyled) |
| `responsive-variants.spec.ts` | Prop variants (filled/outlined/dense/etc.) for 23 components at `md` and `lg` |
| `composites.spec.ts` | 29 composite patterns (multiple components interacting) × 3 styles |
| `missing-css-classes.spec.ts` | Reports Quasar runtime classes the preset doesn't emit yet (safelist gaps) |
| `components/QComposite.spec.ts` | Per-section screenshots of the composites page (7 batches × 3 styles) |
| `investigate.spec.ts` | Core components render visibly on their real routes across styles |
| `comprehensive-tokens.spec.ts` | Computed CSS variables + colors across md3/md2/unstyled and light/dark |
| `functional.spec.ts` | Interactive behavior — clicks, toggles, dialogs, menus, URL state sync |
| `review.spec.ts` | `/review` gallery page — drawer, carousel, style chips, search |
| `style-switcher.spec.ts` | Body-class style switching (`setStyle`), default is md3 |
| `unstyled.spec.ts` | Unstyled style — no preset theming leaks |
| `ssr.spec.ts` | SSR dev server health + page render |
| `debug-css-check.spec.ts` | Debug CSS helper |
| `components/*.spec.ts` | 73 per-component files — renders cleanly ×3 styles, dark mode, MD2/MD3 spec conformance, prop variations |

Run the full suite (1280 tests): `pnpm test`

## Quasar Styling — unocss-preset-quasar 0.5.1

Styling comes from [`unocss-preset-quasar`](https://www.npmjs.com/package/unocss-preset-quasar)
**0.5.1** (resolved from the npm registry, no local link). SASS is disabled
(`disableSass: true` in `vitrify.config.ts`); the preset replaces
`quasar/dist/quasar.sass` with UnoCSS-generated utilities and CSS variables.

Three styles are registered via `QuasarPreset({ styles })` in
`vitrify.config.ts` (entries imported from `unocss-preset-quasar/styles`):

- **md3** (default) — Material Design 3 tokens
- **md2** — Material Design 2 look (sharp 4px corners, outlined inputs)
- **unstyled** — HTML defaults only, no preset theming

How it works on the 0.5.x architecture:

- A **single shared component tree** driven by CSS-variable tokens; styles differ
  only in token values (no duplicate per-style CSS). The first style entry is
  also emitted unscoped on `:root`, so the default style applies with zero config.
- Rules are scoped to `body.quasar-style-{name}`; the app toggles the active
  style via the `?style=` URL param (`useStyle.ts`) and `setStyle()`/
  `getActiveStyle()` from `unocss-preset-quasar/styles`. Dark mode swaps
  `--light-*` → `--dark-*` tokens via `body--dark` (`?dark=true`).
- Switching styles is **instant** (no reload): all three styles' rules ship in
  the bundle, so `setStyle()` applies the body class, persists the choice to
  `localStorage` (`quasar-style`) and updates the URL via `router.replace`.
- `packages/app/index.html` ships a tiny inline script that resolves the same
  `?style=` → `localStorage` → md3 chain **before first paint**, so fresh
  loads (including the SSG build's prerendered HTML) never flash the unscoped
  `:root` md3 defaults before hydration/app boot.
- Tokens are generated from `VITE_SOURCE_COLOR` (`#6750a4` in `packages/app/.env`)
  via `@poupe/material-color-utilities` and exposed as `--q-*` / `--light-*` /
  `--dark-*` variables.

0.5.x behaviors the tests account for:

- Component backgrounds are emitted as `color-mix(in oklab, var(--q-*-bg), …)`,
  so `getComputedStyle()` returns **`oklab(...)`** strings instead of `rgb(...)`
  (visually identical). Tests assert colors via a 1×1 canvas round-trip
  (`computedRgba()` in `tests/helpers.ts`).
- `--q-btn-radius`: md3 = `--q-radius-xl` (28px), md2 = `--q-radius-sm` (4px),
  unstyled = 0.

## Build

```bash
pnpm build:app:csr    # Client-side only
pnpm build:app:ssr    # Server-side rendering
pnpm build:app:ssg    # Static site generation
```
