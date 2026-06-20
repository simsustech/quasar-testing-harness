<script lang="ts">
export default {
  name: 'QStepperPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qStepperDefaults,
  qStepperSchema
} from '../../components/props/QStepperProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qStepperDefaults,
  modelValue: 'shipping'
} as const

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

// Coerce empty strings to undefined so Quasar falls back to its canonical defaults
const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    out[k] = v === '' ? undefined : v
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
    <div class="text-h6 q-mb-xs">QStepper</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-stepper</code> — props driven by URL query string.
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
      <q-stepper v-bind="boundProps">
        <q-step name="cart" title="Cart" icon="i-mdi-cart-outline" :done="true" />
        <q-step name="shipping" title="Shipping" icon="i-mdi-truck-fast-outline" :done="false" />
        <q-step name="payment" title="Payment" icon="i-mdi-credit-card-outline" :done="false" />
        <q-step name="review" title="Review" icon="i-mdi-check-circle-outline" :done="false" />
      </q-stepper>
    </div>

    <ControlPanel
      :schema="qStepperSchema"
      :model-value="props"
      title="QStepper"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
