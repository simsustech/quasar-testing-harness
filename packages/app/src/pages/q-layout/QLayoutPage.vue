<script lang="ts">
export default {
  name: 'QLayoutPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qLayoutDefaults,
  qLayoutSchema
} from '../../components/props/QLayoutProps'
import { useQueryProps } from '../../composables/useQueryProps'

const route = useRoute()
const isUnstyled = computed(() => route.query.style === 'unstyled')
const headerStyle = computed(() =>
  isUnstyled.value ? {} : { background: 'var(--light-primary)', color: 'white' }
)

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qLayoutDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QLayout</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-layout</code> — props driven by URL query string.
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
        min-height: 280px;
      "
    >
      <q-layout
        v-bind="boundProps"
        style="width: 100%; height: 200px; border-radius: 4px; overflow: hidden"
      >
        <q-header :style="headerStyle">
          <q-toolbar>
            <q-toolbar-title>Header</q-toolbar-title>
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <p>This is a q-page inside the q-layout's q-page-container.</p>
          </q-page>
        </q-page-container>
      </q-layout>
    </div>

    <ControlPanel
      :schema="qLayoutSchema"
      :model-value="props"
      title="QLayout"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
