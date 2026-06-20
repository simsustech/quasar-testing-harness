<script lang="ts">
export default {
  name: 'QPageScrollerPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qPageScrollerDefaults,
  qPageScrollerSchema
} from '../../components/props/QPageScrollerProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qPageScrollerDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QPageScroller</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-page-scroller</code> — props driven by URL query string.
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
      <div style="width: 300px; height: 120px; overflow: auto; border: 1px solid #eee; position: relative">
        <div v-for="i in 12" :key="i" class="q-pa-xs">Line {{ i }}</div>
        <q-page-scroller v-bind="boundProps" position="bottom-right" :offset="[8, 8]" />
      </div>
    </div>

    <ControlPanel
      :schema="qPageScrollerSchema"
      :model-value="props"
      title="QPageScroller"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
