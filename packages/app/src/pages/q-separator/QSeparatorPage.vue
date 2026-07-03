<script lang="ts">
export default {
  name: 'QSeparatorPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qSeparatorDefaults,
  qSeparatorSchema
} from '../../components/props/QSeparatorProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qSeparatorDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QSeparator</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-separator</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      style="
        padding: 32px;
        background: var(--q-dark-page, #fff);
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
      "
    >
      <div style="width: 300px">
        <div class="text-body1 q-mb-xs">Above the separator</div>
        <q-separator v-bind="boundProps" spaced />
        <div class="text-body1 q-mt-xs">Below the separator</div>
      </div>
    </div>

    <ControlPanel
      :schema="qSeparatorSchema"
      :model-value="props"
      title="QSeparator"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
