<script lang="ts">
export default {
  name: 'QPopupEditPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qPopupEditDefaults,
  qPopupEditSchema
} from '../../components/props/QPopupEditProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qPopupEditDefaults,
  modelValue: 'Click to edit',
  validate: ''
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
    <div class="text-h6 q-mb-xs">QPopupEdit</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-popup-edit</code> — props driven by URL query string.
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
      <div style="width: 100%; max-width: 400px">
        <q-popup-edit v-bind="boundProps" title="Edit note" label-set="Save" auto-save>
          <div style="padding: 8px 12px; border: 1px solid #c0c0c0; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: space-between">
            <span>{{ props.modelValue || 'Click to edit' }}</span>
            <q-icon name="i-mdi-pencil" size="16px" color="grey" />
          </div>
        </q-popup-edit>
      </div>
    </div>

    <ControlPanel
      :schema="qPopupEditSchema"
      :model-value="props"
      title="QPopupEdit"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
