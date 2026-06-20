<template>
  <router-view />
</template>

<script lang="ts">
import {
  QBtn,
  QBtnDropdown,
  QBtnGroup,
  QInput,
  QBtnToggle,
  QSelect,
  QField,
  QChip
} from 'quasar'
import {
  setDefaultPropsMd2,
  setDefaultPropsMd3
} from 'unocss-preset-quasar/styles'
import { generateTheme, setThemeColors } from 'unocss-preset-quasar/theme'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Read the active style from the URL at module load time.
 */
function readInitialStyle(): 'md2' | 'md3' | 'unstyled' {
  if (typeof window === 'undefined') return 'md3'
  const params = new URLSearchParams(window.location.search)
  const s = params.get('style')
  if (s === 'md2' || s === 'md3' || s === 'unstyled') return s
  return 'md3'
}

/**
 * Read an optional ?sourceColor= hex from the URL at module load time.
 * Returns null if absent or invalid — the build-time VITE_SOURCE_COLOR
 * default (or the preset's #1976d2 fallback) takes over in that case.
 */
function readInitialSourceColor(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const raw = params.get('sourceColor')
  return raw && /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : null
}

function applySourceColor(hex: string) {
  const theme = generateTheme(hex)
  setThemeColors(theme.colors)
}

const sourceColorOverride = readInitialSourceColor()
if (sourceColorOverride) {
  applySourceColor(sourceColorOverride)
}

const initialStyle = readInitialStyle()

// Set the body class on <body> so the preset's per-style CSS scoping activates.
// The preset wraps every component rule in e.g. body.quasar-style-md3 .q-btn,
// so without the matching body class no component styles match.
document.body.classList.add(
  initialStyle === 'md2'
    ? 'quasar-style-md2'
    : initialStyle === 'unstyled'
    ? 'quasar-style-unstyled'
    : 'quasar-style-md3'
)

if (initialStyle === 'md3') {
  setDefaultPropsMd3({
    QBtn,
    QBtnDropdown,
    QBtnGroup,
    QInput,
    QBtnToggle,
    QSelect,
    QField,
    QChip
  })
} else if (initialStyle === 'md2') {
  setDefaultPropsMd2({
    QBtn,
    QBtnDropdown,
    QBtnGroup,
    QInput,
    QBtnToggle,
    QSelect,
    QField,
    QChip
  })
}

export default {
  name: 'App',
  setup() {
    const route = useRoute()

    const syncBodyClass = (style: string | string[] | null | undefined) => {
      const s = typeof style === 'string' ? style : Array.isArray(style) ? style[0] : undefined
      document.body.classList.remove(
        'quasar-style-md2',
        'quasar-style-md3',
        'quasar-style-unstyled'
      )
      if (s === 'md2') document.body.classList.add('quasar-style-md2')
      else if (s === 'unstyled') document.body.classList.add('quasar-style-unstyled')
      else document.body.classList.add('quasar-style-md3')
    }

    syncBodyClass(route.query.style)

    watch(() => route.query.style, syncBodyClass)

    // React to ?sourceColor changes without a page reload.
    // CSS custom properties update live on <body>.
    watch(
      () => route.query.sourceColor,
      (raw) => {
        if (typeof raw === 'string' && /^#[0-9a-fA-F]{6}$/.test(raw)) {
          applySourceColor(raw)
        }
      }
    )
  }
}
</script>
