<script lang="ts">
export default {
  name: 'QHeaderPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qHeaderDefaults,
  qHeaderSchema
} from '../../components/props/QHeaderProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qHeaderDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QHeader</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-header</code> — props driven by URL query string.
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
      <q-header v-bind="boundProps" class="bg-primary text-white" style="position: relative; display: flex; align-items: center; height: 56px; padding: 0 16px">
        <q-btn flat dense icon="i-mdi-menu" color="white" />
        <q-toolbar-title>Header</q-toolbar-title>
      </q-header>
    </div>

    <ControlPanel
      :schema="qHeaderSchema"
      :model-value="props"
      title="QHeader"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
