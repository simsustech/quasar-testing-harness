<script lang="ts">
export default {
  name: 'QPagePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import { qPageDefaults, qPageSchema } from '../../components/props/QPageProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qPageDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QPage</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-page</code> — props driven by URL query string.
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
      <div
        class="border-grey-3"
        style="width: 300px; height: 200px; border: 1px solid #eee"
      >
        <q-layout container class="bg-white full-height full-width">
          <q-page-container>
            <q-page v-bind="boundProps">
              <p><strong>Page content</strong></p>
              <p>This is a q-page component with padding style applied.</p>
            </q-page>
          </q-page-container>
        </q-layout>
      </div>
    </div>

    <ControlPanel
      :schema="qPageSchema"
      :model-value="props"
      title="QPage"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
