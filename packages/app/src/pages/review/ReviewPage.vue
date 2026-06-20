<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface ScreenshotEntry {
  image: string
  label: string
  style: string
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
const searchQuery = ref('')
const selectedComponent = ref<string | null>(null)
const slideIndex = ref(0)

// Fetch manifest
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

const filteredComponents = computed(() => {
  const m = manifest.value
  if (!m) return []
  return m.groups.filter((g) => {
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase()
      if (!g.component.includes(q)) return false
    }
    if (selectedStyles.value.length === 0) return false
    return g.screenshots.some((s) => selectedStyles.value.includes(s.style))
  })
})

const currentScreenshots = computed(() => {
  const m = manifest.value
  if (!m || !selectedComponent.value) return []
  const group = m.groups.find((g) => g.component === selectedComponent.value)
  if (!group) return []
  return group.screenshots.filter((s) => selectedStyles.value.includes(s.style))
})

// Reset slide index when selected component changes
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
</script>

<template>
  <q-page padding class="review-page">
    <!-- Header -->
    <div class="text-h5 q-mb-md">Screenshot Review</div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-center q-my-xl">
      <q-spinner color="primary" size="3em" />
      <div class="q-mt-sm text-grey-7">Loading screenshots...</div>
    </div>
    <div v-else-if="error" class="text-center q-my-xl">
      <q-icon name="warning" color="orange" size="3em" />
      <div class="q-mt-sm text-grey-7">{{ error }}</div>
    </div>

    <template v-else-if="manifest">
      <!-- Filters bar -->
      <div class="row items-center q-mb-md q-gutter-sm">
        <div class="text-subtitle2">Style:</div>
        <q-chip
          v-for="s in allStyles"
          :key="s"
          :color="selectedStyles.includes(s) ? 'primary' : 'grey-4'"
          :text-color="selectedStyles.includes(s) ? 'white' : 'grey-8'"
          size="md"
          clickable
          @click="toggleStyle(s)"
        >
          {{ s }}
        </q-chip>

        <q-space />

        <q-input
          v-model="searchQuery"
          placeholder="Search component..."
          dense
          outlined
          clearable
          style="min-width: 200px"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <div class="row" style="height: calc(100vh - 220px); gap: 16px">
        <!-- Component list (left panel) -->
        <div
          class="col-12 col-sm-3 component-list"
          style="overflow-y: auto; border: 1px solid #e0e0e0; border-radius: 8px"
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
                <q-item-label>{{ g.component }}</q-item-label>
                <q-item-label caption>
                  {{ g.screenshots.filter((s) => selectedStyles.includes(s.style)).length }} shots
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="filteredComponents.length === 0" disable>
              <q-item-section class="text-grey-5 text-center">
                No components match
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <!-- Carousel (right panel) -->
        <div class="col-12 col-sm-9" style="display: flex; flex-direction: column">
          <div
            v-if="currentScreenshots.length === 0"
            class="text-center text-grey-5 q-my-xl"
          >
            Select a component to view screenshots
          </div>

          <template v-else>
            <q-carousel
              v-model="slideIndex"
              swipeable
              animated
              arrows
              navigation
              navigation-position="bottom"
              style="flex: 1; min-height: 400px; border-radius: 8px; overflow: hidden"
            >
              <q-carousel-slide
                v-for="(shot, i) in currentScreenshots"
                :key="i"
                :name="i"
                class="column items-center justify-center q-pa-sm"
              >
                <div
                  style="
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    overflow: hidden;
                  "
                >
                  <q-img
                    :src="shot.image"
                    fit="contain"
                    style="max-height: 100%; max-width: 100%"
                    spinner-color="primary"
                    loading="lazy"
                  />
                </div>
              </q-carousel-slide>
            </q-carousel>

            <!-- Slide info bar -->
            <div class="row items-center q-mt-sm q-gutter-x-sm q-px-sm">
              <q-badge
                :color="
                  currentScreenshots[slideIndex]?.style === 'md3'
                    ? 'primary'
                    : currentScreenshots[slideIndex]?.style === 'md2'
                      ? 'secondary'
                      : 'grey-7'
                "
              >
                {{ currentScreenshots[slideIndex]?.style }}
              </q-badge>
              <span class="text-subtitle2">
                {{ currentScreenshots[slideIndex]?.label }}
              </span>
              <q-space />
              <span class="text-grey-7 text-caption">
                {{ slideIndex + 1 }} / {{ currentScreenshots.length }}
              </span>
            </div>

            <!-- URL / View Page link -->
            <div
              v-if="currentScreenshots[slideIndex]?.url"
              class="q-mt-xs q-px-sm"
            >
              <router-link
                :to="currentScreenshots[slideIndex]!.url!"
                class="text-caption"
                target="_blank"
              >
                View in Playground &rarr;
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </template>
  </q-page>
</template>

<style scoped>
.review-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.component-list .q-item--active {
  background: var(--q-primary-light, #e3f2fd);
  font-weight: 600;
}

.q-item--active .q-item__label--caption {
  font-weight: 400;
}
</style>
