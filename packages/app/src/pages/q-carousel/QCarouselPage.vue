<script lang="ts">
export default {
  name: 'QCarouselPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qCarouselDefaults,
  qCarouselSchema
} from '../../components/props/QCarouselProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qCarouselDefaults,
  modelValue: 1,
  swipeable: true,
  animated: true
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
    <div class="text-h6 q-mb-xs">QCarousel</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-carousel</code> — props driven by URL query string.
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
      <q-carousel v-bind="boundProps" style="width: 100%">
        <q-carousel-slide name="1" class="column items-center justify-center" style="background: #F2C037">
          <div class="text-h5 text-white">Sunset</div>
          <p class="text-white">First slide</p>
        </q-carousel-slide>
        <q-carousel-slide name="2" class="column items-center justify-center" style="background: #21BA45">
          <div class="text-h5 text-white">Forest</div>
          <p class="text-white">Second slide</p>
        </q-carousel-slide>
        <q-carousel-slide name="3" class="column items-center justify-center" style="background: #31CCEC">
          <div class="text-h5 text-white">Ocean</div>
          <p class="text-white">Third slide</p>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <ControlPanel
      :schema="qCarouselSchema"
      :model-value="props"
      title="QCarousel"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
