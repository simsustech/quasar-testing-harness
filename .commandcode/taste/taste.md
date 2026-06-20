# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Architecture
See [architecture/taste.md](architecture/taste.md)
# Stack
- Use Vitrify with Quasar (Material Design 3 preset via `unocss-preset-quasar`) and UnoCSS instead of SASS. Confidence: 0.60
- Use pnpm workspaces for monorepo structure (apps live under `packages/<name>`). Confidence: 0.85
- Keep solutions simple — prefer the minimal approach that works over clever/complex patterns. Confidence: 0.85
# Workflow
- Learn as you go — capture patterns and preferences incrementally during work, not just at the end. Confidence: 0.80
- For multi-component work: complete and verify one component before moving to the next (validate before proceeding). Confidence: 0.80
# Testing
- For component playground tests: verify props actually work by inspecting rendered DOM (assert on class names, text content, child elements like `.q-spinner`) — not just that pages return HTTP 200 or load. Confidence: 0.75
- For component playground tests: use screenshots specifically for style/CSS analysis (visual regression of computed styles, classes, layout) — combine with DOM inspection for functional correctness, the two are complementary not interchangeable. Confidence: 0.80
- For Quasar/Vue Playwright tests: use `page.goto(url, { waitUntil: 'networkidle' })` plus `waitForSelector` on the preview element, and attach `pageerror`/`console`/`requestfailed` listeners — Quasar renders blank instead of throwing when something is misconfigured, so without these diagnostics a failing test gives no signal. Confidence: 0.80
- For component playground screenshot tests: screenshot only the component preview region (no control panel, no layout/header), not fullPage — keeps the visual baseline focused on the component being tested. Confidence: 0.80

# Quasar Components

- Per-component pages for two-way-bound props (modelValue on QDialog, QMenu, QTooltip, QBottomSheet, etc.) must use a local `ref` initialized from `pageDefaults`, wired via `v-model`, not `v-bind`. Just passing modelValue through `v-bind` loses reactivity and prevents the dialog/menu/tooltip from opening/closing. Confidence: 0.95
- QVirtualScroll's `:items` prop should be a static local data array, not mixed into boundProps or the generated defaults. Passing items through `v-bind` alongside a template-scope `:items` causes duplicate-prop Vue errors. Confidence: 0.85
- QDialogPage template: use `:model-value="true"` statically on the `<q-dialog>` element (not from pageDefaults) to ensure it opens immediately on page load for screenshot/baseline tests. Confidence: 0.80
- When a Quasar component is mounted as an empty shell (`<q-tabs />` without `<q-tab>` children, `<q-carousel />` without `<q-carousel-slide>`, etc.), it produces useless screenshots. Every component page must include realistic slot children matching the Quasar nesting pattern. Confidence: 0.90

# Testing

- Playwright test suite should use one test file per component, run consecutively, not one large `all-components.spec.ts` with parallel workers. This avoids cold-start timeouts and makes each component independently debuggable. Confidence: 0.90
