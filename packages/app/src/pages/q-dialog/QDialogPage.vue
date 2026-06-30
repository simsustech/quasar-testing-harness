<script lang="ts">
export default {
  name: 'QDialogPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qDialogDefaults,
  qDialogSchema
} from '../../components/props/QDialogProps'
import { useQueryProps } from '../../composables/useQueryProps'

const pageDefaults = {
  ...qDialogDefaults,
  modelValue: true,
  persistent: '',
  noEscDismiss: ''
} as const

const { props, setProp, reset, bindModel } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (k === 'modelValue') continue
    if (v !== '') out[k] = v
  }
  return out
})
const vmodel = bindModel('modelValue')

const open = () => setProp('modelValue', true as never)

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
    <div class="text-h6 q-mb-xs">QDialog</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-dialog</code> — props driven by URL query string.
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
      <q-btn label="Open dialog" color="primary" @click="open" />
      <q-dialog v-model="vmodel" v-bind="boundProps">
        <q-card>
          <q-card-section class="text-h6">Dialog title</q-card-section>
          <q-card-section>This is the dialog content.</q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" color="primary" v-close-popup />
            <q-btn flat label="OK" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <ControlPanel
      :schema="qDialogSchema"
      :model-value="props"
      title="QDialog"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
