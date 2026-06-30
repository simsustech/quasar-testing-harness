<script lang="ts">
export default {
  name: 'QMenuPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qMenuDefaults,
  qMenuSchema
} from '../../components/props/QMenuProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qMenuDefaults,
  modelValue: true
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
    <div class="text-h6 q-mb-xs">QMenu</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-menu</code> — props driven by URL query string.
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
      <q-btn label="Menu" color="primary">
        <q-menu v-bind="boundProps" anchor="bottom right" self="top right">
          <q-list style="min-width: 160px">
            <q-item clickable><q-item-section>Edit</q-item-section></q-item>
            <q-item clickable><q-item-section>Delete</q-item-section></q-item>
            <q-separator />
            <q-item clickable><q-item-section>More</q-item-section></q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <ControlPanel
      :schema="qMenuSchema"
      :model-value="props"
      title="QMenu"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
