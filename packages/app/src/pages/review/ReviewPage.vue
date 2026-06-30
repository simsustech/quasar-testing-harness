<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface ScreenshotEntry {
  image: string
  label: string
  style: string
  device: string
  url: string | null
}

interface ScreenshotGroup {
  component: string
  screenshots: ScreenshotEntry[]
}

interface Manifest {
  generatedAt: string
  groups: ScreenshotGroup[]
}

const manifest = ref<Manifest | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const selectedStyles = ref<string[]>(['md3', 'md2', 'unstyled'])
const selectedDevices = ref<string[]>(['desktop', 'sm', 'md', 'lg'])
const searchQuery = ref('')
const selectedComponent = ref<string | null>(null)
const slideIndex = ref(0)
const drawerOpen = ref(true)

fetch('/screenshots/manifest.json')
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .then((data) => {
    manifest.value = data
    if (data.groups.length > 0) {
      selectedComponent.value = data.groups[0].component
    }
    loading.value = false
  })
  .catch((e) => {
    error.value = `No screenshots found — run tests then pnpm generate:screenshots. (${e.message})`
    loading.value = false
  })

const allStyles = ['md3', 'md2', 'unstyled']
const allDevices = ['desktop', 'sm', 'md', 'lg']

const filteredComponents = computed(() => {
  const m = manifest.value
  if (!m) return []
  return m.groups.filter((g) => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!g.component.includes(q)) return false
    }
    if (selectedStyles.value.length === 0) return false
    if (selectedDevices.value.length === 0) return false
    return g.screenshots.some(
      (s) => selectedStyles.value.includes(s.style) && selectedDevices.value.includes(s.device)
    )
  })
})

const currentScreenshots = computed(() => {
  const m = manifest.value
  if (!m || !selectedComponent.value) return []
  const group = m.groups.find((g) => g.component === selectedComponent.value)
  if (!group) return []
  return group.screenshots.filter(
    (s) => selectedStyles.value.includes(s.style) && selectedDevices.value.includes(s.device)
  )
})

watch(selectedComponent, () => {
  slideIndex.value = 0
})

const toggleStyle = (style: string) => {
  const idx = selectedStyles.value.indexOf(style)
  if (idx >= 0) {
    if (selectedStyles.value.length > 1) {
      selectedStyles.value.splice(idx, 1)
    }
  } else {
    selectedStyles.value.push(style)
  }
}

const toggleDevice = (device: string) => {
  const idx = selectedDevices.value.indexOf(device)
  if (idx >= 0) {
    if (selectedDevices.value.length > 1) {
      selectedDevices.value.splice(idx, 1)
    }
  } else {
    selectedDevices.value.push(device)
  }
}
</script>

<template>
  <q-layout class="review-layout">
    <q-drawer
      v-model="drawerOpen"
      side="left"
      :width="200"
      bordered
      class="bg-grey-1"
    >
      <q-list dense separator>
        <q-item
          v-for="g in filteredComponents"
          :key="g.component"
          clickable
          :active="selectedComponent === g.component"
          @click="selectedComponent = g.component"
          v-ripple
        >
          <q-item-section>
            <q-item-label class="text-caption">{{ g.component }}</q-item-label>
            <q-item-label caption class="text-caption">
              {{ g.screenshots.filter((s) => selectedStyles.includes(s.style)).length }} shots
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="filteredComponents.length === 0" disable>
          <q-item-section class="text-grey-5 text-center">No components match</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <div class="q-pa-sm">
        <div class="row items-center q-mb-sm q-gutter-xs" style="min-height: 40px">
          <q-btn
            flat round dense icon="i-mdi-menu"
            data-testid="drawer-toggle"
            @click="drawerOpen = !drawerOpen"
            size="sm"
          />
          <div class="text-subtitle2 text-grey-8 q-mr-sm">Screenshot Review</div>
          <div class="row items-center q-gutter-xs">
            <q-chip
              v-for="s in allStyles"
              :key="s"
              :color="selectedStyles.includes(s) ? 'primary' : 'grey-3'"
              :text-color="selectedStyles.includes(s) ? 'white' : 'grey-7'"
              size="sm" dense clickable
              @click="toggleStyle(s)"
            >{{ s }}</q-chip>
          </div>
          <div class="row items-center q-gutter-xs q-ml-sm">
            <q-chip
              v-for="d in allDevices"
              :key="d"
              :color="selectedDevices.includes(d) ? 'orange' : 'grey-3'"
              :text-color="selectedDevices.includes(d) ? 'white' : 'grey-7'"
              size="sm" dense clickable
              @click="toggleDevice(d)"
            >{{ d }}</q-chip>
          </div>
          <q-space />
          <q-input
            v-model="searchQuery" placeholder="Search..." dense outlined clearable
            style="min-width: 140px; max-width: 220px"
          >
            <template v-slot:prepend><q-icon name="i-mdi-magnify" /></template>
          </q-input>
        </div>

        <div v-if="loading" class="column items-center justify-center" style="height: 60vh">
          <q-spinner color="primary" size="3em" />
          <div class="q-mt-sm text-grey-7">Loading screenshots...</div>
        </div>
        <div v-else-if="error" class="column items-center justify-center" style="height: 60vh">
          <q-icon name="i-mdi-alert-circle" color="orange" size="3em" />
          <div class="q-mt-sm text-grey-7">{{ error }}</div>
        </div>

        <div v-else-if="currentScreenshots.length === 0" class="column items-center justify-center text-grey-5" style="height: 60vh">
          Select a component to view screenshots
        </div>

        <div v-else class="column" style="min-height: 400px; height: calc(100vh - 200px)">
          <q-carousel
            v-model="slideIndex"
            swipeable animated arrows
            navigation navigation-position="bottom"
            style="flex: 1; min-height: 0"
          >
            <q-carousel-slide
              v-for="(shot, i) in currentScreenshots"
              :key="i" :name="i"
              class="column items-center justify-center"
            >
              <q-img
                :src="shot.image"
                fit="contain"
                style="max-height: 100%; max-width: 100%"
                spinner-color="primary" loading="lazy"
              />
            </q-carousel-slide>
          </q-carousel>

          <div class="row items-center q-mt-xs q-gutter-x-xs q-px-sm" style="min-height: 32px">
            <q-badge
              :color="currentScreenshots[slideIndex]?.style === 'md3' ? 'primary' : currentScreenshots[slideIndex]?.style === 'md2' ? 'secondary' : 'grey-7'"
            >{{ currentScreenshots[slideIndex]?.style }}</q-badge>
            <q-badge color="orange" outline>
              {{ currentScreenshots[slideIndex]?.device }}
            </q-badge>
            <span class="text-caption text-weight-medium">{{ currentScreenshots[slideIndex]?.label }}</span>
            <q-space />
            <router-link v-if="currentScreenshots[slideIndex]?.url"
              :to="currentScreenshots[slideIndex]!.url!" class="text-caption" target="_blank"
            >View in Playground &rarr;</router-link>
            <span class="text-grey-6 text-caption q-ml-sm">{{ slideIndex + 1 }} / {{ currentScreenshots.length }}</span>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.review-layout {
  height: 100%;
  position: relative;
}
</style>
