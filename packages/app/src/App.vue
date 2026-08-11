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

function readInitialStyle(): string {
  if (typeof window === 'undefined') return 'md3'
  return new URLSearchParams(window.location.search).get('style') || 'md3'
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
