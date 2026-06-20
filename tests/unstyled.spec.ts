import { test, expect } from '@playwright/test'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Absolute path to the preset's style barrel. The preset lives in a
 * sibling workspace (`../unocss-preset-quasar/packages/preset/`) so the
 * import must be resolved with an absolute file URL — a bare specifier
 * won't work because the test runs in the root workspace, not the app's.
 */
const PRESET_ENTRY = pathToFileURL(
  path.resolve(process.cwd(), '..', 'unocss-preset-quasar', 'packages', 'preset', 'src', 'styles', 'index.ts')
).href

/**
 * Smoke test for the `Unstyled` style export.
 *
 * We import the preset's source directly (not the built `dist`) so this
 * test works without a `pnpm build` step and stays in sync with the
 * source.
 */
test('Unstyled style export has the expected shape', async () => {
  const mod = await import(PRESET_ENTRY)
  expect(typeof mod.Unstyled).toBe('object')
  expect(Array.isArray(mod.Unstyled.rules)).toBe(true)
  expect(Array.isArray(mod.Unstyled.variants)).toBe(true)
  expect(Array.isArray(mod.Unstyled.preflights)).toBe(true)
  expect(Array.isArray(mod.Unstyled.shortcuts)).toBe(true)
  // The whole point of Unstyled: nothing should be added on top of the
  // Quasar default styles.
  expect(mod.Unstyled.rules).toEqual([])
  expect(mod.Unstyled.variants).toEqual([])
  expect(mod.Unstyled.preflights).toEqual([])
  expect(mod.Unstyled.shortcuts).toEqual([])
})

test('All three style exports (MD2, MD3, Unstyled) are importable', async () => {
  const mod = await import(PRESET_ENTRY)
  expect(mod.MaterialDesign2).toBeTruthy()
  expect(mod.MaterialDesign3).toBeTruthy()
  expect(mod.Unstyled).toBeTruthy()
  // setDefaultProps helpers for each style
  expect(typeof mod.setDefaultPropsMd2).toBe('function')
  expect(typeof mod.setDefaultPropsMd3).toBe('function')
  expect(typeof mod.setDefaultPropsUnstyled).toBe('function')
  // Unstyled's setDefaultProps must be a safe no-op
  expect(() => mod.setDefaultPropsUnstyled()).not.toThrow()
})
