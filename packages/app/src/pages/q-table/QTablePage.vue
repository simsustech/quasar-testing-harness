<script lang="ts">
export default {
  name: 'QTablePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qTableDefaults,
  qTableSchema
} from '../../components/props/QTableProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qTableDefaults,
  title: 'Recent orders',
  rows: [
    { id: 1, name: 'Frozen yoghurt', calories: 159, fat: 6.0, carbs: 24, protein: 4.0 },
    { id: 2, name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, protein: 4.3 },
    { id: 3, name: 'Eclair', calories: 262, fat: 16.0, carbs: 24, protein: 6.0 },
    { id: 4, name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3 },
    { id: 5, name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, protein: 3.9 }
  ],
  columns: [
    { name: 'name', label: 'Dessert', field: 'name', align: 'left' },
    { name: 'calories', label: 'Calories', field: 'calories', align: 'right' },
    { name: 'fat', label: 'Fat (g)', field: 'fat', align: 'right' },
    { name: 'carbs', label: 'Carbs (g)', field: 'carbs', align: 'right' },
    { name: 'protein', label: 'Protein (g)', field: 'protein', align: 'right' }
  ],
  rowKey: 'id'
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
    <div class="text-h6 q-mb-xs">QTable</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-table</code> — props driven by URL query string.
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
      <q-table v-bind="boundProps" />
    </div>

    <ControlPanel
      :schema="qTableSchema"
      :model-value="props"
      title="QTable"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
