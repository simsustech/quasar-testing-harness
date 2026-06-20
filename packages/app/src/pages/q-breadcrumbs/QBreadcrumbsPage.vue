<script lang="ts">
export default {
  name: 'QBreadcrumbsPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qBreadcrumbsDefaults,
  qBreadcrumbsSchema
} from '../../components/props/QBreadcrumbsProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qBreadcrumbsDefaults
} as const

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

// Coerce empty strings to undefined so Quasar falls back to its canonical defaults
const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    out[k] = v === '' ? undefined : v
  }
  return out
})

const onUpdate = (next: Record<string, unknown>) => {
  for (const k of Object.keys(next)) {
    if (next[k] !== props[k]) {
      setProp(k as never, next[k] as never)
    }
  }
}
</script>

<template>
  <q-page padding>
    <div class="text-h6 q-mb-xs">QBreadcrumbs</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-breadcrumbs</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      style="
        padding: 32px;
        background: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
      "
    >
      <q-breadcrumbs v-bind="boundProps">
        <q-breadcrumb-el label="Home" icon="i-mdi-home" />
        <q-breadcrumb-el label="Products" icon="i-mdi-package-variant-closed" />
        <q-breadcrumb-el label="Shoes" />
      </q-breadcrumbs>
    </div>

    <ControlPanel
      :schema="qBreadcrumbsSchema"
      :model-value="props"
      title="QBreadcrumbs"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
