<script lang="ts">
export default {
  name: 'QScrollAreaPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qScrollAreaDefaults,
  qScrollAreaSchema
} from '../../components/props/QScrollAreaProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qScrollAreaDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QScrollArea</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-scroll-area</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      style="
        padding: 32px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
      "
    >
      <q-scroll-area
        v-bind="boundProps"
        style="width: 300px; height: 150px; border: 1px solid #eee"
      >
        <div class="q-pa-sm">
          <p v-for="i in 8" :key="i" class="q-mb-xs">
            Line {{ i }}: Lorem ipsum dolor sit amet.
          </p>
        </div>
      </q-scroll-area>
    </div>

    <ControlPanel
      :schema="qScrollAreaSchema"
      :model-value="props"
      title="QScrollArea"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
