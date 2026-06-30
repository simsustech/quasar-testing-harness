<script lang="ts">
export default {
  name: 'QFooterPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qFooterDefaults,
  qFooterSchema
} from '../../components/props/QFooterProps'
import { useQueryProps } from '../../composables/useQueryProps'

const route = useRoute()
const isUnstyled = computed(() => route.query.style === 'unstyled')
const footerStyle = computed(() => ({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '48px',
  ...(isUnstyled.value
    ? {}
    : {
        backgroundColor: 'var(--light-primary)',
        color: 'var(--light-on-primary)'
      })
}))

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qFooterDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QFooter</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-footer</code> — props driven by URL query string.
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
      <q-footer v-bind="boundProps" :style="footerStyle">
        <div>Footer — © 2024</div>
      </q-footer>
    </div>

    <ControlPanel
      :schema="qFooterSchema"
      :model-value="props"
      title="QFooter"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
