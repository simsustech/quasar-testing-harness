<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar'
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const route = useRoute()

function readInitialDark(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('dark') === 'true'
}

onMounted(() => {
  if (readInitialDark()) $q.dark.set(true)
})

watch(() => route.query.dark, (val) => {
  $q.dark.set(val === 'true')
})
</script>
