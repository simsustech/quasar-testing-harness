<script lang="ts">
export default {
  name: 'QTimelinePage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qTimelineDefaults,
  qTimelineSchema
} from '../../components/props/QTimelineProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qTimelineDefaults as unknown as Record<string, unknown>
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
    <div class="text-h6 q-mb-xs">QTimeline</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-timeline</code> — props driven by URL query string.
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
      <q-timeline v-bind="boundProps" color="primary">
        <q-timeline-entry title="Task #1" subtitle="2024-01-01" icon="i-mdi-check-circle">
          <div>First task completed</div>
        </q-timeline-entry>
        <q-timeline-entry title="Task #2" subtitle="2024-01-02" icon="i-mdi-information">
          <div>Second task in progress</div>
        </q-timeline-entry>
        <q-timeline-entry title="Task #3" subtitle="2024-01-03" icon="i-mdi-alert">
          <div>Third task pending</div>
        </q-timeline-entry>
      </q-timeline>
    </div>

    <ControlPanel
      :schema="qTimelineSchema"
      :model-value="props"
      title="QTimeline"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
