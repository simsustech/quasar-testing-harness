import { type Page } from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs'

const SHOTS = path.join(process.cwd(), 'packages', 'app', 'public', 'screenshots')

export const styleFromPage = async (page: Page): Promise<string> => {
  try {
    const s = new URL(page.url()).searchParams.get('style')
    if (s === 'md2' || s === 'md3' || s === 'unstyled') return s
  } catch { /* */ }
  return 'md3'
}

export const shotPath = (
  component: string,
  label: string | Record<string, string> = 'default',
  styleSlug = 'md3'
) => {
  const dir = path.join(SHOTS, styleSlug, component)
  fs.mkdirSync(dir, { recursive: true })
  const tag =
    typeof label === 'string'
      ? label
      : Object.entries(label)
          .map(([k, v]) => `${k}-${v}`)
          .join('__')
  const safe = tag
    .replace(/[/\\?%*:|"<>&=+\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return path.join(dir, `${component}__${safe || 'default'}.png`)
}

export const shot = async (
  page: Page,
  component: string,
  label: string | Record<string, string>,
  styleSlug?: string
) => {
  const file = shotPath(component, label, styleSlug ?? (await styleFromPage(page)))
  await page.getByTestId('component-preview').screenshot({ path: file })
  return file
}

export const dumpDiagnostics = async (
  page: Page,
  component: string,
  label: string | Record<string, string>,
  styleSlug?: string
) => {
  const slug = styleSlug ?? (await styleFromPage(page))
  const file = shotPath(component, label, slug).replace(/\.png$/, '.json')
  const data = await page.evaluate(() => {
    const root = document.querySelector(
      '[data-testid="component-preview"]'
    ) as HTMLElement | null
    if (!root) return { found: false }
    const rootStyle = window.getComputedStyle(root)
    const collectVars = (s: CSSStyleDeclaration) => {
      const out: Record<string, string> = {}
      for (let i = 0; i < s.length; i++) {
        const p = s.item(i)
        if (p.startsWith('--')) out[p] = s.getPropertyValue(p).trim()
      }
      return out
    }
    const firstInteractive = root.querySelector(
      'button, a, input, [role="button"]'
    ) as HTMLElement | null
    let interactive: Record<string, string> | null = null
    if (firstInteractive) {
      const s = window.getComputedStyle(firstInteractive)
      interactive = {
        tag: firstInteractive.tagName,
        className: firstInteractive.className,
        text: firstInteractive.textContent?.trim() ?? '',
        backgroundColor: s.backgroundColor,
        color: s.color,
        borderRadius: s.borderRadius,
        borderColor: s.borderColor,
        boxShadow: s.boxShadow,
        opacity: s.opacity,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        vars: collectVars(s)
      }
    }
    return {
      found: true,
      url: location.href,
      root: {
        className: root.className,
        backgroundColor: rootStyle.backgroundColor,
        color: rootStyle.color,
        vars: collectVars(rootStyle)
      },
      interactive
    }
  })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
  return file
}

/**
 * Query computed CSS styles for one or more DOM elements inside the
 * component preview container.  Returns a map of selector → prop → value.
 *
 * Selectors are resolved relative to `[data-testid="component-preview"]`.
 * Use `:root` for the preview container itself.
 *
 * Example:
 *   const s = await computedStyles(page, {
 *     '.q-toggle__inner': ['font-size'],
 *     '.q-toggle__thumb': ['left', 'width', 'height']
 *   })
 *   expect(s['.q-toggle__inner']?.['font-size']).toBe('34px')
 */
export const computedStyles = async (
  page: Page,
  map: Record<string, string[]>
): Promise<Record<string, Record<string, string>>> => {
  return page.evaluate((map) => {
    const root = document.querySelector(
      '[data-testid="component-preview"]'
    ) as HTMLElement | null
    if (!root) return {}
    const result: Record<string, Record<string, string>> = {}
    for (const [selector, props] of Object.entries(map)) {
      const el =
        selector === ':root'
          ? root
          : (root.querySelector(selector) as HTMLElement | null)
      if (!el) {
        result[selector] = {}
        continue
      }
      const style = window.getComputedStyle(el)
      result[selector] = {}
      for (const prop of props) {
        result[selector][prop] = style.getPropertyValue(prop)
      }
    }
    return result
  }, map)
}

/**
 * Get computed styles from pseudo-elements (::before, ::after).
 *
 * Example:
 *   const s = await pseudoStyles(page, {
 *     '.q-toggle__thumb': { pseudo: '::before', props: ['opacity', 'transform'] }
 *   })
 */
export const pseudoStyles = async (
  page: Page,
  map: Record<string, { pseudo: string; props: string[] }>
): Promise<Record<string, Record<string, string>>> => {
  return page.evaluate((map) => {
    const root = document.querySelector(
      '[data-testid="component-preview"]'
    ) as HTMLElement | null
    if (!root) return {}
    const result: Record<string, Record<string, string>> = {}
    for (const [selector, { pseudo, props }] of Object.entries(map)) {
      const el = root.querySelector(selector) as HTMLElement | null
      if (!el) {
        result[selector] = {}
        continue
      }
      const style = window.getComputedStyle(el, pseudo)
      result[selector] = {}
      for (const prop of props) {
        result[selector][prop] = style.getPropertyValue(prop)
      }
    }
    return result
  }, map)
}
