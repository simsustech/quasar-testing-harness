<template>
  <router-view />
</template>

<script lang="ts">

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

const initialStyle = readInitialStyle()

// Set the body class on <body> so the preset's per-style CSS scoping activates.
// The preset wraps every component rule in e.g. body.quasar-style-md3 .q-btn,
// so without the matching body class no component styles match.
if (typeof document !== 'undefined') {
  document.body.classList.add(
    initialStyle === 'md2'
      ? 'quasar-style-md2'
      : initialStyle === 'unstyled'
      ? 'quasar-style-unstyled'
      : 'quasar-style-md3'
  )
}


export default {
  name: 'App'
}
</script>
