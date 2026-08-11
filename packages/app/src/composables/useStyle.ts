import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * The three Quasar styles exposed by `unocss-preset-quasar/styles`,
 * each tagged with the body class that the preset scopes its rules to.
 *
 * The body class is added/removed on `<body>` whenever the active style
 * changes, so the matching scoped rules apply and the others don't.
 *
 * Switching styles triggers a `location.reload()` so the page boots
 * cleanly for the freshly selected style (per-page component props are
 * configured statically and not re-derived without a fresh mount).
 * `packages/app/index.html` ships a tiny inline script that applies the
 * `?style=` body class before first paint, so the reloaded page never
 * flashes the preset's unscoped `:root` defaults (md3) before hydration.
 */
export type StyleSlug = 'md2' | 'md3' | 'unstyled'

export interface StyleOption {
  slug: StyleSlug
  label: string
  bodyClass: string
  description: string
}

export const STYLES: readonly StyleOption[] = [
  {
    slug: 'md3',
    label: 'Material Design 3',
    bodyClass: 'quasar-style-md3',
    description:
      'Filled buttons with pill corners, filled inputs, MD3 surface tokens.'
  },
  {
    slug: 'md2',
    label: 'Material Design 2',
    bodyClass: 'quasar-style-md2',
    description: 'Default Quasar look (sharp corners, outlined inputs).'
  },
  {
    slug: 'unstyled',
    label: 'Unstyled',
    bodyClass: 'quasar-style-unstyled',
    description: 'No preset CSS — Quasar ships its HTML defaults only.'
  }
] as const

const DEFAULT_STYLE: StyleSlug = 'md3'

const ALL_BODY_CLASSES = STYLES.map((s) => s.bodyClass)

function parseStyleSlug(raw: unknown): StyleSlug {
  if (raw === 'md2' || raw === 'md3' || raw === 'unstyled') return raw
  return DEFAULT_STYLE
}

/**
 * Drive the playground's active Quasar style from the URL query
 * string `?style=md3|md2|unstyled` (default `md3`).
 *
 * - Reads the URL on mount and on every route.query change.
 * - Sets `<body>`'s class so the matching scoped rules apply.
 * - `setStyle(slug)` writes to the URL via `router.replace` (no full
 *   navigation, just a query-string update), then reloads the page so
 *   per-component default props are re-applied for the new style.
 */
export function useStyle() {
  const route = useRoute()

  const currentSlug = ref<StyleSlug>(parseStyleSlug(route.query.style))

  const current = computed(() => {
    return STYLES.find((s) => s.slug === currentSlug.value) ?? STYLES[0]
  })

  // Keep the body class in sync with `currentSlug`. We do NOT reload
  // here — reloads happen explicitly in `setStyle` so the URL is the
  // single source of truth.
  const applyBodyClass = (slug: StyleSlug) => {
    if (typeof document === 'undefined') return
    const target = STYLES.find((s) => s.slug === slug)!.bodyClass
    for (const cls of ALL_BODY_CLASSES) {
      document.body.classList.toggle(cls, cls === target)
    }
  }

  // Initial body class application.
  applyBodyClass(currentSlug.value)

  // React to URL changes from elsewhere (back/forward, programmatic
  // navigation). We don't reload here — we assume the navigation came
  // from `setStyle` which already reloaded.
  watch(
    () => route.query.style,
    (raw) => {
      const slug = parseStyleSlug(raw)
      if (slug !== currentSlug.value) {
        currentSlug.value = slug
        applyBodyClass(slug)
      }
    }
  )

  const setStyle = (slug: StyleSlug) => {
    if (slug === currentSlug.value) return
    // Apply the body class eagerly so the visible style updates
    // immediately. We use history.replaceState directly (not
    // vue-router) so the URL is committed before we reload — vue-
    // router's reactive update otherwise races the reload and the
    // new module load ends up reading the old URL.
    applyBodyClass(slug)
    if (typeof window !== 'undefined') {
      try {
        const url = new URL(window.location.href)
        url.searchParams.set('style', slug)
        window.history.replaceState({}, '', url.toString())
      } catch {
        // URL construction cannot fail for location.href, but keep the
        // switch working even if it ever does — the reload below reads
        // the current URL regardless.
      }
      window.location.reload()
    }
  }

  return {
    currentSlug,
    current,
    setStyle,
    styles: STYLES
  }
}
