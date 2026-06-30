<script lang="ts">
export default {
  name: 'QTabsPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qTabsDefaults,
  qTabsSchema
} from '../../components/props/QTabsProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qTabsDefaults,
  modelValue: 'overview'
} as const

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

// Coerce empty strings to undefined so Quasar falls back to its canonical defaults
const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (v !== '') out[k] = v
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
    <div class="text-h6 q-mb-xs">QTabs</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-tabs</code> — props driven by URL query string.
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
      <q-tabs v-bind="boundProps">
        <q-tab name="overview" label="Overview" icon="i-mdi-view-dashboard-outline" />
        <q-tab name="details" label="Details" icon="i-mdi-information-outline" />
        <q-tab name="reviews" label="Reviews" icon="i-mdi-comment-text-outline" />
      </q-tabs>
    </div>

    <ControlPanel
      :schema="qTabsSchema"
      :model-value="props"
      title="QTabs"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
