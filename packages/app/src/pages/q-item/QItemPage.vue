<script lang="ts">
export default {
  name: 'QItemPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import { qItemDefaults, qItemSchema } from '../../components/props/QItemProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qItemDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QItem</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-item</code> — props driven by URL query string.
    </p>

    <div
      class="preview q-mb-md"
      data-testid="component-preview"
      :style="previewStyle"
    >
      <q-item v-bind="boundProps" clickable>
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">A</q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>Alice</q-item-label>
          <q-item-label caption>Online</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="i-mdi-chevron-right" />
        </q-item-section>
      </q-item>
    </div>

    <ControlPanel
      :schema="qItemSchema"
      :model-value="props"
      title="QItem"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
