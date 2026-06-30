<script lang="ts">
export default {
  name: 'IndexPage'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { components, type Milestone } from '../router/components'

const groups = computed(() => {
  const m: Record<Milestone, typeof components> = {
    M1: [],
    M2: [],
    M3: []
  }
  for (const c of components) m[c.milestone].push(c)
  return m
})

const labels: Record<Milestone, string> = {
  M1: 'M1 — Simple / high-value',
  M2: 'M2 — Interactive / composite',
  M3: 'M3 — Complex / layout'
}
</script>

<template>
  <q-page padding>
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h5 q-mb-xs">Quasar Component Playground</div>
        <p class="text-grey-7 q-mb-none">
          {{ components.length }} components. Navigate to any route to render
          the component in the exact state defined by the URL query string.
        </p>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center q-gutter-sm">
        <q-btn
          unelevated
          color="secondary"
          icon="i-mdi-image-multiple"
          label="Screenshot Review"
          to="/review"
        />
        <q-btn
          outline
          color="primary"
          icon="i-mdi-layers"
          label="Composite Patterns"
          to="/composites"
        />
      </q-card-section>
    </q-card>

    <div
      v-for="milestone in (['M1', 'M2', 'M3'] as Milestone[])"
      :key="milestone"
      class="q-mb-lg"
    >
      <div
        class="text-overline text-grey-6 q-mb-sm"
      >
        {{ labels[milestone] }} ({{ groups[milestone].length }})
      </div>

      <q-list dense separator>
        <q-item
          v-for="c in groups[milestone]"
          :key="c.slug"
          :to="`/${c.slug}`"
          :data-component="c.name"
          tag="router-link"
          clickable
        >
          <q-item-section>{{ c.name }}</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>
