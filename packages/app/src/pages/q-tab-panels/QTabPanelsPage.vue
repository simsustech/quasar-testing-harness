<script lang="ts">
export default {
  name: 'QTabPanelsPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qTabPanelsDefaults,
  qTabPanelsSchema
} from '../../components/props/QTabPanelsProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qTabPanelsDefaults,
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
    <div class="text-h6 q-mb-xs">QTabPanels</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-tab-panels</code> — props driven by URL query string.
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
      <q-tab-panels v-bind="boundProps">
        <q-tab-panel name="overview">High-level summary of the product.</q-tab-panel>
        <q-tab-panel name="details">Detailed specifications and metadata.</q-tab-panel>
        <q-tab-panel name="reviews">What customers are saying.</q-tab-panel>
      </q-tab-panels>
    </div>

    <ControlPanel
      :schema="qTabPanelsSchema"
      :model-value="props"
      title="QTabPanels"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
