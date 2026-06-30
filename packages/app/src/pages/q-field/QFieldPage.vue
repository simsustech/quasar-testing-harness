<script lang="ts">
export default {
  name: 'QFieldPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qFieldDefaults,
  qFieldSchema
} from '../../components/props/QFieldProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qFieldDefaults,
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
    <div class="text-h6 q-mb-xs">QField</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-field</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      :style="previewStyle"
    >
      <q-field v-bind="boundProps" label="Label" stack-label>
        <template v-slot:control>
          <div class="text-body1">Field value</div>
        </template>
      </q-field>
    </div>

    <ControlPanel
      :schema="qFieldSchema"
      :model-value="props"
      title="QField"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
