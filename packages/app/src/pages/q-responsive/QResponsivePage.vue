<script lang="ts">
export default {
  name: 'QResponsivePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qResponsiveDefaults,
  qResponsiveSchema
} from '../../components/props/QResponsiveProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qResponsiveDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QResponsive</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-responsive</code> — props driven by URL query string.
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
      <div style="width: 300px">
        <q-responsive v-bind="boundProps" :ratio="16 / 9">
          <div
            class="full-width full-height flex items-center justify-center bg-primary text-white"
          >
            16:9 container
          </div>
        </q-responsive>
      </div>
    </div>

    <ControlPanel
      :schema="qResponsiveSchema"
      :model-value="props"
      title="QResponsive"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
