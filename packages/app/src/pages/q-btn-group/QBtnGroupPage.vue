<script lang="ts">
export default {
  name: 'QBtnGroupPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qBtnGroupDefaults,
  qBtnGroupSchema
} from '../../components/props/QBtnGroupProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qBtnGroupDefaults,
  rounded: '',
  outline: '',
  flat: '',
  unelevated: '',
  push: '',
  square: ''
} as const

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QBtnGroup</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-btn-group</code> — props driven by URL query string.
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
      <q-btn-group v-bind="boundProps">
        <q-btn label="One" />
        <q-btn label="Two" />
        <q-btn label="Three" />
      </q-btn-group>
    </div>

    <ControlPanel
      :schema="qBtnGroupSchema"
      :model-value="props"
      title="QBtnGroup"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
