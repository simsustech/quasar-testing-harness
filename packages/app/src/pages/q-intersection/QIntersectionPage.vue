<script lang="ts">
export default {
  name: 'QIntersectionPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qIntersectionDefaults,
  qIntersectionSchema
} from '../../components/props/QIntersectionProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qIntersectionDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QIntersection</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-intersection</code> — props driven by URL query string.
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
      <div style="height: 300px; overflow: auto; border: 1px solid #eee">
        <div style="height: 200px" class="flex items-center justify-center bg-grey-3">Scroll down</div>
        <q-intersection v-bind="boundProps" once>
          <div class="bg-green-1 q-pa-md text-center">This appeared when visible</div>
        </q-intersection>
        <div style="height: 100px" class="flex items-center justify-center bg-grey-3">More content</div>
      </div>
    </div>

    <ControlPanel
      :schema="qIntersectionSchema"
      :model-value="props"
      title="QIntersection"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
