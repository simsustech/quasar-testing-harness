<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar
        style="gap: 8px; padding: 0 16px; min-height: 48px"
        data-testid="app-toolbar"
      >
        <q-toolbar-title style="font-size: 14px; font-weight: 500">
          <router-link
            to="/"
            style="color: inherit; text-decoration: none"
          >
            Quasar Component Playground
          </router-link>
        </q-toolbar-title>

        <StyleSwitcher />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue'

export default {
  name: 'MainLayout',
  components: {
    // Loaded lazily so the rest of the layout works even if the
    // switcher ever has a transient load-time error.
    StyleSwitcher: defineAsyncComponent(
      () => import('../components/StyleSwitcher.vue')
    )
  }
}
</script>