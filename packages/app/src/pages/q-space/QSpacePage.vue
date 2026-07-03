<script lang="ts">
export default {
  name: 'QSpacePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import { qSpaceSchema } from '../../components/props/QSpaceProps'
import { useQueryProps } from '../../composables/useQueryProps'

const defaults = {}

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: defaults as unknown as Record<string, unknown>
})

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
    <div class="text-h6 q-mb-xs">QSpace</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-space</code> — flex spacer between elements.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      style="
        padding: 32px;
        background: var(--q-dark-page, #fff);
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        min-height: 120px;
        display: flex;
        align-items: center;
      "
    >
      <div style="background: #1976d2; color: #fff; padding: 8px 12px; border-radius: 4px">Left</div>
      <q-space />
      <div style="background: #388e3c; color: #fff; padding: 8px 12px; border-radius: 4px">Right</div>
    </div>

    <ControlPanel
      :schema="qSpaceSchema"
      :model-value="props"
      title="QSpace"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
