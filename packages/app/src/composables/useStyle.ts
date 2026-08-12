import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * The three Quasar styles exposed by `unocss-preset-quasar/styles`,
 * each tagged with the body class that the preset scopes its rules to.
 *
 * The body class is added/removed on `<body>` whenever the active style
 * changes, so the matching scoped rules apply and the others don't.
 *
 * The active style comes from the `?style=` URL param, falling back to the
 * persisted `localStorage` choice (`quasar-style`), then `md3`. All three
 * styles' rules ship in the bundle (scoped to `body.quasar-style-*`), so
 * switching is instant — `setStyle()` just applies the body class and
 * updates the URL, no reload. `packages/app/index.html` ships a tiny inline
 * script that applies the same resolution before first paint, so fresh
 * loads (including the SSG build's prerendered HTML) never flash the
 * preset's unscoped `:root` defaults (md3) before hydration.
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

/** localStorage key the inline pre-paint script in index.html also reads. */
const STORAGE_KEY = 'quasar-style'

const ALL_BODY_CLASSES = STYLES.map((s) => s.bodyClass)

function parseStyleSlug(raw: unknown): StyleSlug {
  if (raw === 'md2' || raw === 'md3' || raw === 'unstyled') return raw
  return DEFAULT_STYLE
}

function isStyleSlug(v: unknown): v is StyleSlug {
  return v === 'md2' || v === 'md3' || v === 'unstyled'
}

/** The style persisted by `setStyle` (or a ?style= param), or null when none. */
function readStoredStyle(): StyleSlug | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isStyleSlug(stored) ? stored : null
  } catch {
    return null
  }
}

function writeStoredStyle(slug: StyleSlug): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, slug)
  } catch {
    /* storage unavailable */
  }
}

/**
 * Drive the playground's active Quasar style from the URL query
 * string `?style=md3|md2|unstyled` (default `md3`).
 *
 * - Reads the URL on mount and on every route.query change.
 * - Sets `<body>`'s class so the matching scoped rules apply.
 * - `setStyle(slug)` persists the choice to localStorage, applies the
 *   body class immediately and updates the URL via `router.replace` —
 *   no navigation, no reload: switching is instant.
 */
export function useStyle() {
  const route = useRoute()
  const router = useRouter()

  const rawUrlStyle = route.query.style
  const hasUrlStyle = rawUrlStyle !== undefined && rawUrlStyle !== null
  const urlSlug = parseStyleSlug(rawUrlStyle)

  // URL param wins (shared links, tests) and ALSO persists: a ?style= link
  // keeps its style when navigating to pages without the param.
  if (hasUrlStyle && isStyleSlug(rawUrlStyle)) writeStoredStyle(urlSlug)

  const initialSlug: StyleSlug = hasUrlStyle
    ? urlSlug
    : (readStoredStyle() ?? DEFAULT_STYLE)

  const currentSlug = ref<StyleSlug>(initialSlug)

  const current = computed(() => {
    return STYLES.find((s) => s.slug === currentSlug.value) ?? STYLES[0]
  })

  // Keep the body class in sync with `currentSlug` (URL changes from
  // back/forward or programmatic navigation are handled by the watch
  // below; the initial apply happens at setup, before first paint).
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
  // navigation). `setStyle` updates the URL via `router.replace`, which
  // triggers this watch — the eager apply already flipped the body class,
  // so this only reconciles `currentSlug` (and the switcher label).
  watch(
    () => route.query.style,
    (raw) => {
      // Same resolution as setup: an explicit ?style= wins (and persists);
      // without one the stored choice applies, so navigating to a page with
      // no ?style= does NOT revert to the default md3.
      if (raw !== undefined && raw !== null && isStyleSlug(raw)) {
        writeStoredStyle(raw)
      }
      const slug =
        raw === undefined || raw === null
          ? (readStoredStyle() ?? DEFAULT_STYLE)
          : parseStyleSlug(raw)
      if (slug !== currentSlug.value) {
        currentSlug.value = slug
        applyBodyClass(slug)
      }
    }
  )

  const setStyle = (slug: StyleSlug) => {
    if (slug === currentSlug.value) return
    currentSlug.value = slug
    // Apply the body class eagerly so the visible style updates
    // immediately — the tokens are all in the bundle, so there is no
    // reload and no flash.
    applyBodyClass(slug)
    if (typeof window !== 'undefined') {
      writeStoredStyle(slug)
      router.replace({ query: { ...route.query, style: slug } })
    }
  }

  return {
    currentSlug,
    current,
    setStyle,
    styles: STYLES
  }
}
