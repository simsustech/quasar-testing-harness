<script lang="ts">
export default {
  name: 'QPageStickyPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qPageStickyDefaults,
  qPageStickySchema
} from '../../components/props/QPageStickyProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qPageStickyDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QPageSticky</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-page-sticky</code> — props driven by URL query string.
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
      <div
        class="relative-position"
        style="
          width: 300px;
          height: 150px;
          border: 1px solid #eee;
          overflow: auto;
        "
      >
        <div class="q-pa-sm">Scroll this container</div>
        <div v-for="i in 8" :key="i" class="q-px-sm q-pb-xs">Line {{ i }}</div>
        <q-page-sticky
          v-bind="boundProps"
          position="bottom-right"
          :offset="[8, 8]"
        >
          <q-btn round color="primary" icon="i-mdi-chevron-up" />
        </q-page-sticky>
      </div>
    </div>

    <ControlPanel
      :schema="qPageStickySchema"
      :model-value="props"
      title="QPageSticky"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
