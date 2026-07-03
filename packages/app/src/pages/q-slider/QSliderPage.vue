<script lang="ts">
export default {
  name: 'QSliderPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qSliderDefaults,
  qSliderSchema
} from '../../components/props/QSliderProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qSliderDefaults,
  modelValue: 35
} as const

const { props, setProp, reset, bindModel } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (k === 'modelValue') continue
    if (v !== '') out[k] = v
  }
  return out
})
const vmodel = bindModel('modelValue')

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
    <div class="text-h6 q-mb-xs">QSlider</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-slider</code> — props driven by URL query string.
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
      <q-slider v-bind="boundProps" v-model="vmodel" style="width: 200px" />
    </div>

    <ControlPanel
      :schema="qSliderSchema"
      :model-value="props"
      title="QSlider"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
