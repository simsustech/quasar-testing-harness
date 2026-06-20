<script lang="ts">
export default {
  name: 'Error404Page'
}
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page padding class="flex flex-center column">
        <div class="text-h2 q-mb-sm">404</div>
        <p class="text-grey-7 q-mb-md">Page not found.</p>
        <q-btn flat no-caps to="/" label="Home" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
