<script lang="ts">
export default {
  name: 'QSkeletonPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qSkeletonDefaults,
  qSkeletonSchema
} from '../../components/props/QSkeletonProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qSkeletonDefaults,
  animation: 'none'
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
    <div class="text-h6 q-mb-xs">QSkeleton</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-skeleton</code> — props driven by URL query string.
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
      <div style="width: 300px">
        <q-skeleton v-bind="boundProps" type="rect" width="300px" height="48px" style="background: #e0e0e0;" />
        <q-skeleton v-bind="boundProps" type="text" width="200px" height="16px" style="margin-top: 8px; background: #e0e0e0;" />
        <q-skeleton v-bind="boundProps" type="circle" size="48px" style="margin-top: 8px; background: #e0e0e0;" />
      </div>
    </div>

    <ControlPanel
      :schema="qSkeletonSchema"
      :model-value="props"
      title="QSkeleton"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
