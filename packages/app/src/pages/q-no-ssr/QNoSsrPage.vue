<script lang="ts">
export default {
  name: 'QNoSsrPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qNoSsrDefaults,
  qNoSsrSchema
} from '../../components/props/QNoSsrProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qNoSsrDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QNoSsr</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-no-ssr</code> — props driven by URL query string.
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
      <q-no-ssr v-bind="boundProps">
        <div>This content is NOT server-side rendered.</div>
      </q-no-ssr>
    </div>

    <ControlPanel
      :schema="qNoSsrSchema"
      :model-value="props"
      title="QNoSsr"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
