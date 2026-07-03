<script lang="ts">
export default {
  name: 'QBtnPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qBtnDefaults,
  qBtnSchema
} from '../../components/props/QBtnProps'
import { useQueryProps } from '../../composables/useQueryProps'

/**
 * Default props for this page. We start from the auto-generated
 * `qBtnDefaults` and override the ones where the per-style
 * `setDefaultProps` (set in App.vue) should win — i.e. the MD3 spec
 * rounded buttons / filled inputs. Using empty string here means
 * `boundProps` coerces them to `undefined`, so Quasar falls back to
 * the prop default that App.vue set.
 */
const pageDefaults = {
  ...qBtnDefaults,
  rounded: '',
  flat: '',
  unelevated: '',
  outline: '',
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
    <div class="text-h6 q-mb-xs">QBtn</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-btn</code> — props driven by URL query string.
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
      <q-btn v-bind="boundProps" />
    </div>

    <ControlPanel
      :schema="qBtnSchema"
      :model-value="props"
      title="QBtn"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
