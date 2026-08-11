<script lang="ts">
export default {
  name: 'QInputPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qInputDefaults,
  qInputSchema
} from '../../components/props/QInputProps'
import { useQueryProps } from '../../composables/useQueryProps'

/**
 * Same pattern as QBtnPage: empty-string the props where the per-style
 * `setDefaultProps` should win (MD3 spec: filled input).
 */
const pageDefaults = {
  ...qInputDefaults,
  filled: '',
  outlined: '',
  borderless: '',
  standout: ''
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
    <div class="text-h6 q-mb-xs">QInput</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-input</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      :style="previewStyle"
    >
      <q-input
        v-bind="boundProps"
        label="Full name"
        hint="Enter your full name"
      />
    </div>

    <ControlPanel
      :schema="qInputSchema"
      :model-value="props"
      title="QInput"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
