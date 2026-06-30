<script lang="ts">
export default {
  name: 'QInfiniteScrollPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qInfiniteScrollDefaults,
  qInfiniteScrollSchema
} from '../../components/props/QInfiniteScrollProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qInfiniteScrollDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QInfiniteScroll</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-infinite-scroll</code> — props driven by URL query string.
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
      <div style="width: 300px; height: 150px; border: 1px solid #eee; overflow: auto">
        <q-infinite-scroll v-bind="boundProps">
          <div v-for="i in 5" :key="i" class="q-pa-xs">
            <q-item>{{ 'Item ' + i }}</q-item>
          </div>
        </q-infinite-scroll>
      </div>
    </div>

    <ControlPanel
      :schema="qInfiniteScrollSchema"
      :model-value="props"
      title="QInfiniteScroll"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
