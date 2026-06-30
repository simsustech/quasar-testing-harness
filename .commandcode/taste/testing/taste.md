# Testing
- Use Playwright's built-in `webServer` config (not manual server management) for test infrastructure — Playwright handles lifecycle, health checks, and port management more reliably. Confidence: 0.60
- Playwright test suite should use one test file per component, run consecutively, not one large `all-components.spec.ts` with parallel workers. This avoids cold-start timeouts and makes each component independently debuggable. Confidence: 0.90
- For large Playwright test suites: split tests into multiple script commands and run sequentially with `run-s` (npm-run-all) instead of a single `playwright test tests/` command, to avoid timeout issues with many test files. Confidence: 0.85
- Responsive viewport screenshot tests should capture all component variants, not just the `default` variant — components like `q-btn` have multiple prop combinations (colors, sizes, shapes) and each variant needs screenshots at every viewport. Confidence: 0.65
- Individual component render/screenshot tests should complete quickly (ideally sub-second, not 4s+). Investigate and fix slow tests rather than accepting multi-second per-test times. Confidence: 0.65
- For Playwright `webServer` config: use `vitrify dev` (dev server), not `serve` or a static file server — keeps modules bundled and served by Vite's dev server rather than serving pre-built static assets. Confidence: 0.85
