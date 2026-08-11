<script lang="ts">
export default {
  name: 'QMarkupTablePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qMarkupTableDefaults,
  qMarkupTableSchema
} from '../../components/props/QMarkupTableProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qMarkupTableDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QMarkupTable</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-markup-table</code> — props driven by URL query string.
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
      <q-markup-table v-bind="boundProps">
        <thead>
          <tr>
            <th>Dessert</th>
            <th>Calories</th>
            <th>Fat (g)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frozen yoghurt</td>
            <td>159</td>
            <td>6.0</td>
          </tr>
          <tr>
            <td>Ice cream sandwich</td>
            <td>237</td>
            <td>9.0</td>
          </tr>
          <tr>
            <td>Eclair</td>
            <td>262</td>
            <td>16.0</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <ControlPanel
      :schema="qMarkupTableSchema"
      :model-value="props"
      title="QMarkupTable"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
