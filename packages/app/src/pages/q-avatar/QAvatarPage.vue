<script lang="ts">
export default {
  name: 'QAvatarPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qAvatarDefaults,
  qAvatarSchema
} from '../../components/props/QAvatarProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qAvatarDefaults,
  size: '56px',
  color: 'primary',
  textColor: 'white',
  fontSize: '20px'
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
    <div class="text-h6 q-mb-xs">QAvatar</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-avatar</code> — props driven by URL query string.
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
      <q-avatar v-bind="boundProps"><span style="line-height: 1">JD</span></q-avatar>
    </div>

    <ControlPanel
      :schema="qAvatarSchema"
      :model-value="props"
      title="QAvatar"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
