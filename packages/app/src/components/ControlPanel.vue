<script lang="ts">
export default {
  name: 'ControlPanel'
}
</script>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { PropSchema } from '../types/props'

const props = defineProps<{
  schema: PropSchema[]
  modelValue: T
  title?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: T]
  reset: []
}>()

const getValue = (key: string) =>
  (props.modelValue as Record<string, unknown>)[key]

const onUpdate = (key: string, value: unknown) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value
  } as T)
}

const onReset = () => emit('reset')
</script>

<template>
  <q-card flat bordered class="control-panel">
    <q-card-section>
      <div
        class="q-mb-md"
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
        "
      >
        <div class="text-subtitle2">
          Control Panel
          <span v-if="title" class="text-grey-6 text-weight-regular">
            — {{ title }}
          </span>
        </div>
        <q-btn
          flat
          size="sm"
          label="Reset"
          data-action="reset"
          @click="onReset"
        />
      </div>

      <div
        v-for="entry in schema"
        :key="entry.key"
        class="q-mb-sm"
        :data-prop="entry.key"
      >
        <q-input
          v-if="entry.type === 'string'"
          :model-value="String(getValue(entry.key) ?? '')"
          :label="entry.key"
          dense
          outlined
          :data-prop-input="entry.key"
          @update:model-value="onUpdate(entry.key, ($event as string) || '')"
        />

        <q-input
          v-else-if="entry.type === 'number'"
          :model-value="Number(getValue(entry.key) ?? 0)"
          :label="entry.key"
          type="number"
          dense
          outlined
          :data-prop-input="entry.key"
          @update:model-value="onUpdate(entry.key, Number($event))"
        />

        <div v-else-if="entry.type === 'boolean'" style="padding: 8px 0">
          <q-toggle
            :model-value="Boolean(getValue(entry.key))"
            :label="entry.key"
            left-label
            color="primary"
            :data-prop-input="entry.key"
            @update:model-value="onUpdate(entry.key, $event)"
          />
        </div>

        <q-select
          v-else-if="entry.type === 'select'"
          :model-value="String(getValue(entry.key) ?? '')"
          :label="entry.key"
          :options="(entry.options ?? []).map((o) => String(o))"
          dense
          outlined
          :data-prop-input="entry.key"
          @update:model-value="onUpdate(entry.key, ($event as string) || '')"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
