# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# Architecture
See [architecture/taste.md](architecture/taste.md)
# Stack
- Use Vitrify with Quasar (Material Design 3 preset via `unocss-preset-quasar`) and UnoCSS instead of SASS. Confidence: 0.60
- Use pnpm workspaces for monorepo structure (apps live under `packages/<name>`). Confidence: 0.85
- Keep solutions simple — prefer the minimal approach that works over clever/complex patterns. Confidence: 0.85
# UI Patterns
- For empty state in Quasar `q-list` pages: keep the list structure and add a `<q-item>` placeholder inside the list rather than replacing the list with a separate placeholder element or using a plain `<div>`. Confidence: 0.80

# Process Management
- Do not kill the Node process directly — killing the Node process in CMD will also kill the CMD process itself. Use `nohup` or similar mechanisms to detach/disown instead of terminating. Confidence: 0.90

# Workflow
- Learn as you go — capture patterns and preferences incrementally during work, not just at the end. Confidence: 0.80
- For multi-component work: complete and verify one component before moving to the next (validate before proceeding). Confidence: 0.80
- Start with the simplest approach first when debugging or investigating — avoid escalating to complex analysis/code before checking the most basic causes. Confidence: 0.80
# Testing
- For component playground tests: verify props actually work by inspecting rendered DOM (assert on class names, text content, child elements like `.q-spinner`) — not just that pages return HTTP 200 or load. Confidence: 0.75
- For component playground tests: use screenshots specifically for style/CSS analysis (visual regression of computed styles, classes, layout) — combine with DOM inspection for functional correctness, the two are complementary not interchangeable. Confidence: 0.80
- For Quasar/Vue Playwright tests: use `page.goto(url, { waitUntil: 'networkidle' })` plus `waitForSelector` on the preview element, and attach `pageerror`/`console`/`requestfailed` listeners — Quasar renders blank instead of throwing when something is misconfigured, so without these diagnostics a failing test gives no signal. Confidence: 0.80
- For Playwright console listeners: capture `console.warn` in addition to `console.error` — Quasar/Vue emits warnings for prop validation failures, deprecation notices, and misconfigurations that don't cause errors but indicate real problems. Confidence: 0.70
- For component playground screenshot tests: screenshot only the component preview region (no control panel, no layout/header), not fullPage — keeps the visual baseline focused on the component being tested. Confidence: 0.80

# Quasar Components

- Per-component pages for two-way-bound props (modelValue on QDialog, QMenu, QTooltip, QBottomSheet, etc.) must use a local `ref` initialized from `pageDefaults`, wired via `v-model`, not `v-bind`. Just passing modelValue through `v-bind` loses reactivity and prevents the dialog/menu/tooltip from opening/closing. Confidence: 0.95
- QVirtualScroll's `:items` prop should be a static local data array, not mixed into boundProps or the generated defaults. Passing items through `v-bind` alongside a template-scope `:items` causes duplicate-prop Vue errors. Confidence: 0.85
- QDialogPage template: use `:model-value="true"` statically on the `<q-dialog>` element (not from pageDefaults) to ensure it opens immediately on page load for screenshot/baseline tests. Confidence: 0.80
- When a Quasar component is mounted as an empty shell (`<q-tabs />` without `<q-tab>` children, `<q-carousel />` without `<q-carousel-slide>`, etc.), it produces useless screenshots. Every component page must include realistic slot children matching the Quasar nesting pattern. Confidence: 0.90
- Avoid importing from the `'quasar'` barrel in application code — the `virtual:quasar` module barrel-exports all 80+ components, plugins, directives, composables, and utilities, so even `import { QBtn } from 'quasar'` triggers loading the entire framework. Use per-component import paths or configure the Quasar plugin with an explicit component list to avoid loading unused components. Confidence: 0.70

# Testing
See [testing/taste.md](testing/taste.md)
