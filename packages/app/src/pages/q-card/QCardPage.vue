<script lang="ts">
export default {
  name: 'QCardPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qCardDefaults,
  qCardSchema
} from '../../components/props/QCardProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qCardDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QCard</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-card</code> — props driven by URL query string.
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
      <q-card v-bind="boundProps" style="width: 300px; padding: 16px">
        <div class="text-h6">Our Changing Planet</div>
        <div class="text-subtitle2">by John Doe</div>
        <div class="q-mt-sm">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </div>
      </q-card>
    </div>

    <ControlPanel
      :schema="qCardSchema"
      :model-value="props"
      title="QCard"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
