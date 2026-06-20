# PROGRESS — Style Switcher + QLayout/QDrawer fixes + MD2 visual distinctness

## 2026-06-17

### Context
- Branch: `cmd`
- Workspace: `/home/stefan/Projects/unocss-preset-quasar` (preset)
- Playground: `/home/stefan/Projects/quasar-dev` (quasar-testing-harness)

### Phase 1 — Style switcher (DONE, committed `12282f1`)
- Per-style body-class scoping in preset (`packages/preset/src/styles/_scope.ts`)
- `useStyle` composable + `StyleSwitcher` dropdown in MainLayout top bar
- URL-driven: `?style=md3|md2|unstyled`
- 5 new tests in `tests/style-switcher.spec.ts`

### Phase 2 — QLayout / QDrawer rendering (DONE)
- QLayout page: was rendering empty `<div class="q-layout"><!----><!----></div>`.
  Added `q-header` + `q-page-container` > `q-page` children with minimal
  content.
- QDrawer page: was rendering empty `<aside>` because QDrawer requires a
  `q-layout` ancestor. Wrapped the QDrawer in a `q-layout container`,
  added `q-page-container` with a toggle button. Also drops `modelValue`
  from `boundProps` (v-model controls it).
- Both pages now produce meaningful visual baselines.

### Phase 3 — Prop type warnings (DONE)
- QDrawer was warning: `Invalid prop: type check failed for prop "width".
  Expected Number, got String with value "300"`.
- Root cause: the Quasar docs JSON has `type: "Number"` but
  `default: "300"` (string). The auto-generator in
  `packages/tools/src/generate-props.ts` was passing the string through
  unchanged.
- Fix: in `buildEntries()`, when `type === 'number'` and the cleaned
  default is a numeric string, coerce it via `Number(def)`.
- Regenerated all 73 props files; affected entries verified:
  `QDrawer.width: 300` (number), `QDrawer.miniWidth: 57`,
  `QDrawer.breakpoint: 1023`.

### Phase 4 — `setDefaultProps` is per-style (DONE)
- Old App.vue unconditionally called `setDefaultPropsMd3(...)` at module
  load. This mutated `QBtn.props.rounded.default = true` etc. globally,
  so even when the user switched to `?style=md2`, components still had
  the MD3 defaults (rounded buttons, filled inputs).
- Fix: App.vue now reads `?style=` from `window.location.search` and
  dispatches to `setDefaultPropsMd3`, `setDefaultPropsMd2`, or noop.
- Switching styles still triggers a `location.reload()` from
  `useStyle.setStyle()` so the per-style defaults re-apply.
- Test updated to match the new flow.

### Phase 5 — Per-style screenshot folders (TODO)
- Currently `tests/screenshots/<component>/...` is a single bucket.
- Goal: `tests/screenshots/<style>/<component>/...` so MD2/MD3/Unstyled
  baselines are kept separate and the same component can be screenshotted
  in all three styles without overwriting.
- Implementation: the `shotPath` helper inside each spec file
  (`tests/qbtn.spec.ts`, `tests/components.spec.ts`,
  `tests/style-switcher.spec.ts`) needs to read the active style from
  `window.location` or a `?style=` query and prepend it.
- Decision: pass a `styleSlug` to `shot()` explicitly, defaulting to
  `md3` when omitted. The `StyleSwitcher` Playwright tests can then
  request `shot(page, 'qbtn', 'default', 'md2')`.

### Phase 6 — MD2 visual distinctness (TODO)
- Currently MD2's `q-btn` shortcut body is nearly identical to MD3's
  (both use `bg-primary text-white p-16px`). The only diff is MD2 uses
  `bg-transparent` and `[color:inherit]` (no theme tokens), while MD3
  uses `bg-$light-primary` and `text-$light-on-primary` (theme tokens).
  In practice, both render blue because the playground's pages set
  `color="primary"` which Quasar expands to `bg-primary text-white`.
- User feedback: "MD2 seems to look exactly like MD3. You need MD2 to
  adhere to Material Design 2 spec. Take default Quasar CSS as
  reference for MD2."
- MD2 spec key traits (from Quasar's default SASS):
  - Rectangular buttons (4px radius, no pill)
  - No shadows on default buttons (only on hover/active)
  - UPPERCASE button labels by default
  - Outlined inputs (no fill)
  - Subtle borders, no state layers
- Plan:
  1. Update `MaterialDesign2`'s shortcut bodies to match Quasar's
     default SASS (which IS Material Design 2 — that's Quasar's
     default look).
  2. Set `setDefaultPropsMd2` to NOT override Quasar's defaults
     (already a no-op — `QBtn` is the only one called and the function
     body is empty).
  3. Verify in the playground: with `?style=md2`, q-btns are
     rectangular with no shadow and uppercase labels.

### Phase 7 — Test every component (TODO)
- Currently the test suite has 108 tests but only ~11 components get
  dedicated visual baselines. Many components are smoke-tested ("page
  mounts without errors") but don't get a screenshot.
- Plan: walk every page, render it with `?style=md3` (default), verify
  the preview region has the expected first element, take a screenshot.
  Re-run with `?style=md2` and store under the md2 subfolder.
- Output: `tests/screenshots/<style>/<component>/<component>__default.png`
  + matching `.json` sidecar.
- Add a smoke test for each component that explicitly verifies the
  preview region's first interactive element is present.

## Open questions / blockers
None — execution is straightforward.
