<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()

const STYLE_CLASSES = [
  'quasar-style-md2',
  'quasar-style-md3',
  'quasar-style-unstyled'
]

// Mirrors the inline pre-paint script in index.html: ?style= wins, then
// the persisted localStorage choice (written by useStyle.setStyle), then md3.
function readInitialStyle(): string {
  if (typeof window === 'undefined') return 'md3'
  const fromUrl = new URLSearchParams(window.location.search).get('style')
  if (fromUrl === 'md2' || fromUrl === 'md3' || fromUrl === 'unstyled')
    return fromUrl
  try {
    const stored = window.localStorage.getItem('quasar-style')
    if (stored === 'md2' || stored === 'md3' || stored === 'unstyled')
      return stored
  } catch {
    /* storage unavailable */
  }
  return 'md3'
}

onMounted(() => {
  // Set body class for CSS scoping
  const style = readInitialStyle()
  const cls =
    style === 'md2'
      ? 'quasar-style-md2'
      : style === 'unstyled'
        ? 'quasar-style-unstyled'
        : 'quasar-style-md3'
  for (const c of STYLE_CLASSES) document.body.classList.toggle(c, c === cls)
  // Set dark mode
  if (new URLSearchParams(window.location.search).get('dark') === 'true')
    $q.dark.set(true)
})

watch(
  () => route.query.dark,
  (val) => {
    $q.dark.set(val === 'true')
  }
)
</script>
