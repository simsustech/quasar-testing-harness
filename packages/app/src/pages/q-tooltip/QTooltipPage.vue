<script lang="ts">
export default {
  name: 'QTooltipPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qTooltipDefaults,
  qTooltipSchema
} from '../../components/props/QTooltipProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qTooltipDefaults,
  modelValue: true,
  anchor: '',
  self: '',
  offset: ''
} as const
const { props, setProp, reset, bindModel } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})
const vmodel = bindModel('modelValue')

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
    <div class="text-h6 q-mb-xs">QTooltip</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-tooltip</code> — props driven by URL query string.
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
      <q-btn label="Hover me" color="primary">
        <q-tooltip v-model="vmodel" v-bind="boundProps" anchor="top middle" self="bottom middle">
          This is a tooltip with useful information.
        </q-tooltip>
      </q-btn>
    </div>

    <ControlPanel
      :schema="qTooltipSchema"
      :model-value="props"
      title="QTooltip"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
