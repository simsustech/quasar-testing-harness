# Test Coverage Overview

**1353 tests** across **73 per-component spec files**, **12 top-level spec files**, and `tests/helpers.ts`.

## Test Structure

```
tests/
├── helpers.ts                          # shot(), computedRgba(), dumpDiagnostics(), computedStyles(), pseudoStyles()
├── functional.spec.ts                  # Interaction tests (click, toggle, dialog, menu, select)
├── style-switcher.spec.ts              # Body-class style switching: instant, URL+localStorage, no flash
├── unstyled.spec.ts                    # Unstyled style — no preset theming leaks
├── review.spec.ts                       # /review gallery page
├── ssr.spec.ts                          # SSR dev server smoke tests
├── investigate.spec.ts                 # Core component routes render across styles
├── comprehensive-tokens.spec.ts        # Computed CSS vars + colors across styles
├── missing-css-classes.spec.ts         # Quasar runtime classes missing from the preset
├── debug-css-check.spec.ts             # Debug CSS helper
├── composites.spec.ts                  # Composite component pattern tests
├── components/
│   ├── QAvatar.spec.ts
│   ├── QBadge.spec.ts
│   ├── QBanner.spec.ts
│   ...
│   ├── QComposite.spec.ts               # Per-section screenshots of the composites page
│   └── QVirtualScroll.spec.ts
└── screenshots/
    ├── md3/{component}/{label}.png     # MD3 screenshots
    ├── md2/{component}/{label}.png     # MD2 screenshots
    ├── unstyled/{component}/{label}.png # Unstyled screenshots
    └── composites/{label}.png          # Composite screenshots
```

## Per-Component Tests

Every component has a `renders cleanly with ?style={md3|md2|unstyled}` baseline.

Components with **prop variation** screenshots (MD3 only):

| Component | Variants | Covers |
| ----------- | ---------- | -------- |
| QAvatar | 10 | default, rounded, square, text-color, secondary, sizes (xs/sm/lg/xl), font-size |
| QBadge | 11 | default, outline, rounded, transparent, colors (primary/secondary/blue/teal), align (top/middle/bottom), multi-line, no-floating |
| QBanner | 4 | default, dense, inline-actions, no-rounded |
| QBar | 3 | default, dense, dark |
| QBreadcrumbs | 5 | default, gutter-lg, align-center, separator-color, active-color |
| QBtn | 21 | filled, outline, flat, unelevated, rounded, square, push, glossy, no-caps, loading, disabled, sizes (xs/sm/lg/xl), icon, icon+label, colors (primary/secondary/negative/accent), dense |
| QBtnToggle | 6 | default, outline, rounded, flat, color-secondary, dense |
| QBtnGroup | 6 | default, outline, flat, rounded, square, spread |
| QBtnDropdown | 6 | default, outline, flat, rounded, dense, split |
| QCard | 4 | default, flat+bordered, square, dark |
| QCarousel | 5 | default, arrows, navigation, vertical, control-color |
| QChat | 3 | default, dark, left |
| QCheckbox | 6 | checked, unchecked, dense, disabled, color-secondary, left-label |
| QChip | 14 | default, outline, square, dense, colors, removable, clickable, selected, icon-right, sizes, dark, disabled |
| QCircularProgress | — | baseline only |
| QColor | 4 | default, flat, square, no-header |
| QDate | 6 | default, landscape, minimal, dark, flat+bordered, color-secondary |
| QDialog | 6 | default, maximized, position (top, bottom), seamless, square |
| QExpansionItem | 6 | default, dense, popup, switch-toggle-side, hide-expand-icon, expand-separator |
| QFab | 5 | default, outline, square, color-secondary, direction-up |
| QField | 5 | dark, filled-dark, outlined-dark, standard-dark, clearable |
| QFile | 5 | default, filled, outlined, dense, disable |
| QIcon | 3 | default, color-secondary, size-lg |
| QInnerLoading | 4 | default, color-secondary, label, size-lg |
| QInput | 5 | dark, filled-dark, outlined-dark, clearable, dark-clearable |
| QItem | 4 | default, dense, dark, clickable |
| QKnob | 6 | default-65, min, max, color-secondary, disabled, size-lg |
| QLinearProgress | 6 | determinate-65, stripe, indeterminate, query, color-secondary, rounded |
| QMenu | 3 | default, persistent, square |
| QOptionGroup | 3 | default, dense, inline |
| QPagination | 6 | default, outline, rounded, no-boundaries, color-secondary, size-lg |
| QPopupEdit | 3 | default, square, persistent |
| QPullToRefresh | 2 | default, disable |
| QRadio | 6 | default, color-secondary, dense, left-label, keep-color, disabled |
| QRange | 5 | default-25-75, min-max, color-secondary, dense, disabled |
| QRating | 6 | default-4, max-3, color-secondary, size-lg, no-dimming, disabled |
| QScrollArea | 2 | default, dark |
| QSelect | 8 | default-de, no-value, disabled, dense, filled, clearable, dark, dark-clearable |
| QSeparator | 4 | default, dark, vertical, spaced |
| QSkeleton | 3 | default, square, dark |
| QSlideItem | 2 | default, dark |
| QSlider | 5 | default-35, min, max, disabled, color-secondary |
| QSpace | — | baseline only |
| QSpinner | 3 | default, color-secondary, size-lg |
| QSplitter | 3 | default, dark, vertical |
| QStepper | 4 | default, vertical, dark, flat+bordered |
| QTabs | 6 | default, dense, inline-label, no-caps, color-secondary, dark |
| QTime | 5 | default, landscape, dark, flat+bordered, minimal |
| QTimeline | 5 | default, comfortable, loose, side-left, color-secondary |
| QToggle | 10 | default, unchecked, dense (×2), disabled, left-label, color-secondary, keep-color, dark (×2) |
| QToolbar | 2 | default, inset |
| QTooltip | 3 | default, no-parent-event, delay |

**Baseline-only**: QCircularProgress, QSpace (minimal visual styling).

## Composite Pattern Tests

29 composite patterns across all 3 styles (md3, md2, unstyled). Generated via `tests/bin/generate-composites.mjs`.

| Pattern | Components |
| --------- | ----------- |
| QBtn + QTooltip | [.q-btn, .q-tooltip] |
| QBtn + QBadge | [.q-btn, .q-badge] |
| QCard + QCardActions + QBtn | [.q-card, .q-card-actions, .q-btn] |
| QCard + QItem + QAvatar | [.q-card, .q-item, .q-avatar] |
| QToolbar + QBtn | [.q-toolbar, .q-btn] |
| QToolbar + QTabs | [.q-toolbar, .q-tabs, .q-tab] |
| QItem + QAvatar | [.q-item, .q-avatar, .q-item-label] |
| QItem + QBadge | [.q-item, .q-badge] |
| QItem + QCheckbox | [.q-item, .q-checkbox] |
| QItem + QRadio | [.q-item, .q-radio] |
| QItem + QIcon + QToggle | [.q-item, .q-icon, .q-toggle] |
| QExpansionItem + QCard | [.q-expansion-item, .q-card] |
| QBtn + QDialog + QCard | [.q-btn, .q-dialog, .q-card] |
| QHeader + QToolbar + QBtn + QPage | [.q-header, .q-toolbar, .q-btn, .q-page] |
| QHeader + QToolbar + QTabs | [.q-header, .q-toolbar, .q-tabs] |
| QDrawer + QItem + QIcon + QScrollArea | [.q-drawer, .q-item, .q-icon, .q-scroll-area] |
| QFab + QFabAction | [.q-fab, .q-fab-action] |
| QForm + QInput + QBtn | [.q-form, .q-input, .q-btn] |
| QInput + QIcon | [.q-input, .q-icon] |
| QSelect + QChip | [.q-select, .q-chip] |
| QField + QIcon | [.q-field, .q-icon] |
| QKnob + QIcon | [.q-knob, .q-icon] |
| QTabs + QTabPanels | [.q-tabs, .q-tab-panels, .q-tab-panel] |
| QInnerLoading + QCard | [.q-card, .q-inner-loading] |
| QBanner + QBtn | [.q-banner, .q-btn] |
| QLinearProgress + QBadge | [.q-linear-progress, .q-badge] |
| QCheckbox + QItem | [.q-checkbox, .q-item] |
| QMenu + QList + QItem (click) | [.q-menu, .q-list, .q-item] (click to open) |
| QBtnDropdown + QList + QItem (click) | [.q-btn-dropdown, .q-list, .q-item] (click to open) |

## Coverage Scanning & Verification Scripts

Four scripts in `tests/bin/` help find gaps, generate tests, and verify output:

### `scan-composites.mjs`

Scans ALL 257+ composite patterns from Quasar docs examples and reports which ones lack test coverage. Each pattern is a Quasar component that nests other Quasar components inside it.

```bash
node tests/bin/scan-composites.mjs
# Shows: ✓ tested composites, ✗ untested composites with file references
```

### `scan-variants.mjs`

Cross-references three data sources:

1. Test spec files — what prop variations are tested
2. Quasar docs examples — what prop combos are documented  
3. Quasar UI source (`quasar/ui/src/components/*.json`) — all available component props

Reports coverage gaps per component — shows untested doc examples, uncovered Quasar props, and quick-win components.

```bash
node tests/bin/scan-variants.mjs
# Shows per-component: variants tested, props from source, uncovered doc examples
# Quick-wins list at the bottom (components with most gaps)
```

### `generate-composites.mjs`

Regenerates the CompositesPage.vue and composites.spec.ts from a curated set of self-contained, working composite snippets. Run after adding new patterns:

```bash
node tests/bin/generate-composites.mjs
# Overwrites: packages/app/src/pages/composites/CompositesPage.vue
#             tests/composites.spec.ts
```

### `verify-visuals.mjs`

Validates every generated screenshot's computed CSS against MD3 spec values — no browser needed, just reads the `.json` diagnostic files. Checks:

- MD3 theme tokens present (`--light-primary`, `--dark-on-surface`, etc.)
- Interactive element colors match spec where applicable
- Border-radius values conform to MD3 shape tokens

```bash
node tests/bin/verify-visuals.mjs          # MD3 (default)
node tests/bin/verify-visuals.mjs --style=md2
node tests/bin/verify-visuals.mjs --style=unstyled
```

Reads the diagnostic `.json` files written next to every screenshot and validates
computed CSS (border-radius, colors, dimensions) against the MD3 spec values.
Runs in ~2s with no browser — unlike `toHaveScreenshot()` (flaky across
rendering environments), it checks deterministic computed values.

## Computed CSS (Spec Conformance) Tests

| Component | What's asserted |
| ----------- | ---------------- |
| QToggle (MD3) | inner font-size (34px), thumb position (5.1px / 24.65px), label padding (7px), hover glow opacity (0.12), dense font-size (28px) |
| QToggle (MD2) | thumb position > baseline, dense font-size (28px), hover glow visible |
| QField (MD3) | control height (56px), dark mode colors, dense class presence |
| QInput (MD3) | control height (56px), dark mode colors, clear icon presence |
| QSelect (MD3) | clearable padding-right (48px), dropdown icon presence |
| QSelect (MD2) | clearable padding-right (48px) |
| QBadge (MD3) | background color, text color |
| QRadio (MD3) | truthy class on checked state, dense font-size |
| QKnob (MD3) | knob visibility, disabled opacity |
| QDialog (MD3) | border-radius on dialog card |

## Screenshot Protocol

Each prop variation test captures:

1. `{component}__{label}.png` — screenshot of `[data-testid="component-preview"]`
2. `{component}__{label}.json` — computed CSS variables and interactive element styles

Screenshots live in `packages/app/public/screenshots/{style}/{mode}/{device}/{component}/`
(with a `.json` diagnostics file next to each PNG). Composites screenshots go in
the same tree under the `composites` component folder.

## Running Tests

```bash
# Full suite
npx playwright test tests/

# Single component
npx playwright test tests/components/QBtn.spec.ts

# Prop variations only
npx playwright test tests/components/QToggle.spec.ts -g "prop variations"

# Composites only
npx playwright test tests/composites.spec.ts
```
