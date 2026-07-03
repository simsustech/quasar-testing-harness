<script lang="ts">
export default {
  name: 'QBannerPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qBannerDefaults,
  qBannerSchema
} from '../../components/props/QBannerProps'
import { useQueryProps } from '../../composables/useQueryProps'

const route = useRoute()
const isUnstyled = computed(() => route.query.style === 'unstyled')
const bannerStyle = computed(() =>
  isUnstyled.value
    ? {}
    : { background: 'var(--light-primary-container)', color: 'var(--light-on-primary-container)' }
)

const pageDefaults = {
  ...qBannerDefaults,
  rounded: true
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
    <div class="text-h6 q-mb-xs">QBanner</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-banner</code> — props driven by URL query string.
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
      <q-banner v-bind="boundProps" :style="bannerStyle">
        <template v-slot:avatar>
          <q-icon name="i-mdi-alert-circle-outline" color="white" size="24px" />
        </template>
        This banner shows important information to the user.
        <template v-slot:action>
          <q-btn flat label="Action" color="white" />
        </template>
      </q-banner>
    </div>

    <ControlPanel
      :schema="qBannerSchema"
      :model-value="props"
      title="QBanner"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
