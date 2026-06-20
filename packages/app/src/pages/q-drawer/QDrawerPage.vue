<script lang="ts">
export default {
  name: 'QDrawerPage'
}
</script>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  qDrawerDefaults,
  qDrawerSchema
} from '../../components/props/QDrawerProps'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: qDrawerDefaults as unknown as Record<string, unknown>
})

// Coerce empty strings to undefined so Quasar falls back to its canonical defaults
const boundProps = computed(() => {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(props)) {
    if (k === 'modelValue') continue
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

const isOpen = ref(true)
</script>

<template>
  <q-page padding>
    <div class="text-h6 q-mb-xs">QDrawer</div>
    <p class="text-grey-7 q-mb-md">
      Route <code>/q-drawer</code> — props driven by URL query string.
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
        min-height: 280px;
      "
    >
      <q-layout
        :style="{ width: '600px', height: '200px' }"
        container
        style="background: #f5f5f5"
      >
        <q-drawer v-bind="boundProps" v-model="isOpen">
          <q-scroll-area class="fit">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="i-mdi-home" />
                </q-item-section>
                <q-item-section>Home</q-item-section>
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="i-mdi-account" />
                </q-item-section>
                <q-item-section>Profile</q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </q-drawer>
        <q-page-container>
          <q-page padding>
            <q-btn
              unelevated
              color="primary"
              label="Toggle drawer"
              @click="isOpen = !isOpen"
            />
          </q-page>
        </q-page-container>
      </q-layout>
    </div>

    <ControlPanel
      :schema="qDrawerSchema"
      :model-value="props"
      title="QDrawer"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
