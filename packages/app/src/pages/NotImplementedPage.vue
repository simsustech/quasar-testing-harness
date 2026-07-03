<script lang="ts">
export default {
  name: 'NotImplementedPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ControlPanel from '../components/ControlPanel.vue'

const route = useRoute()
const componentName = computed(
  () => (route.meta?.componentName as string) || 'Unknown'
)
const milestone = computed(() => route.meta?.milestone || '?')
const slug = computed(() => String(route.name || '?'))

const placeholderSchema = [
  { key: 'status', type: 'string', default: 'not-implemented' }
] as const
</script>

<template>
  <q-page padding>
    <div class="text-h6 q-mb-xs">{{ componentName }}</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/{{ slug }}</code> — page not yet implemented.
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
        color: #888;
        font-style: italic;
      "
    >
      Milestone {{ milestone }} — implementation coming soon
    </div>

    <ControlPanel
      :schema="placeholderSchema as never"
      :model-value="{ status: 'not-implemented' }"
      :title="componentName"
    />
  </q-page>
</template>
