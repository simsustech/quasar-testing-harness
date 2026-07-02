<script lang="ts">
export default {
  name: 'QBadgePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qBadgeDefaults,
  qBadgeSchema
} from '../../components/props/QBadgeProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qBadgeDefaults,
  label: '3',
  color: 'primary',
  floating: true
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
    <div class="text-h6 q-mb-xs">QBadge</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-badge</code> — props driven by URL query string.
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
      ">
    <div class="q-gutter-sm q-mb-md">
      <q-badge v-bind="boundProps" />
      <q-badge color="blue"> #4D96F2 </q-badge>
      <q-badge color="orange" text-color="black" label="2" />
      <q-badge color="red" rounded label="99+" />
      <q-badge outline color="primary" label="NEW" />
    </div>

    <div style="position: relative; display: inline-flex;">
      <q-icon name="i-mdi-email-outline" size="32px" />
      <q-badge floating color="red" rounded label="5" />
    </div>
    </div>

    <ControlPanel
      :schema="qBadgeSchema"
      :model-value="props"
      title="QBadge"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
