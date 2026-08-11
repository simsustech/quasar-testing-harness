<template>
  <q-btn-dropdown
    dense
    flat
    no-caps
    data-testid="style-switcher"
    :data-current-style="currentSlug"
    :menu-offset="[0, 4]"
    content-class="style-switcher-menu"
  >
    <template #label>
      <span style="display: inline-flex; align-items: center; gap: 6px">
        <q-icon name="i-mdi-palette-swatch" size="18px" />
        <span data-testid="style-switcher-current">
          {{ current.label }}
        </span>
      </span>
    </template>

    <q-list dense style="min-width: 240px">
      <q-item
        v-for="opt in styles"
        :key="opt.slug"
        v-close-popup
        clickable
        :data-testid="`style-option-${opt.slug}`"
        :active="opt.slug === currentSlug"
        active-class="text-primary"
        @click="setStyle(opt.slug)"
      >
        <q-item-section avatar style="min-width: 28px">
          <q-icon
            :name="
              opt.slug === currentSlug
                ? 'i-mdi-radiobox-marked'
                : 'i-mdi-radiobox-blank'
            "
            size="16px"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label style="font-weight: 500">{{ opt.label }}</q-item-label>
          <q-item-label caption style="font-size: 11px; line-height: 1.3">
            {{ opt.description }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
import { useStyle } from '../composables/useStyle'

const { currentSlug, current, setStyle, styles } = useStyle()
</script>
