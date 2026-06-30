<script lang="ts">
export default {
  name: 'QSelectPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qSelectDefaults,
  qSelectSchema
} from '../../components/props/QSelectProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qSelectDefaults,
  filled: '',
  outlined: '',
  borderless: '',
  standout: '',
  label: 'Country',
  modelValue: 'de',
  options: [
    { label: 'Australia', value: 'au' },
    { label: 'Brazil', value: 'br' },
    { label: 'Canada', value: 'ca' },
    { label: 'Germany', value: 'de' },
    { label: 'Japan', value: 'jp' }
  ]
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

const isDark = computed(() => Boolean(props.dark))

const previewStyle = computed(() => ({
  padding: '32px',
  background: isDark.value ? '#333' : '#fff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '120px'
}))

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
    <div class="text-h6 q-mb-xs">QSelect</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-select</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      :style="previewStyle"
    >
      <q-select v-bind="boundProps" />
    </div>

    <ControlPanel
      :schema="qSelectSchema"
      :model-value="props"
      title="QSelect"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
