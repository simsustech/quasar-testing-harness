<script lang="ts">
export default {
  name: 'QChatPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import { useQueryProps } from '../../composables/useQueryProps'

const qChatSchema = [
  { key: 'sent', type: 'boolean', default: false },
  { key: 'label', type: 'string', default: '' },
  { key: 'bgColor', type: 'string', default: '' },
  { key: 'textColor', type: 'string', default: '' },
  { key: 'name', type: 'string', default: '' },
  { key: 'avatar', type: 'string', default: '' },
  { key: 'stamp', type: 'string', default: '' }
] as const

const qChatDefaults = Object.fromEntries(
  qChatSchema.map((s) => [s.key, s.default])
) as Record<string, unknown>

const pageDefaults = {
  ...qChatDefaults
} as const

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: pageDefaults as unknown as Record<string, unknown>
})

const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    out[k] = v === '' ? undefined : v
  }
  return out
})

const messages = [
  { name: 'Alice', text: ['Hey, how are you?'], stamp: '10:30', sent: false },
  { name: 'You', text: ['I\'m good, thanks!', 'Working on the project.'], stamp: '10:32', sent: true, bgColor: 'primary', textColor: 'white' },
  { name: 'Alice', text: ['Great! Let me know if you need help.'], stamp: '10:33', sent: false }
]
</script>

<template>
  <q-page padding>
    <div class="text-h6 q-mb-xs">QChat</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-chat</code> — props driven by URL query string.
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
      <q-chat-message
        v-for="(msg, idx) in messages"
        :key="idx"
        v-bind="{ ...boundProps, ...msg }"
      />
    </div>

    <ControlPanel
      :schema="qChatSchema"
      :model-value="props"
      title="QChat"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
