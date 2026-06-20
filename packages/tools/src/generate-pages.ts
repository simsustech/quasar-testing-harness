#!/usr/bin/env node
/**
 * Generate Q{Name}Page.vue for every component in the manifest.
 *
 * Each page:
 * - imports the schema + defaults from Q{Name}Props.ts
 * - sets up useQueryProps for two-way URL ↔ state binding
 * - renders the component with v-bind on all known props
 *
 * Empty strings are coerced to undefined so Quasar falls back to its
 * canonical defaults.
 *
 * Usage:
 *   pnpm --filter @quasar-testing-harness/tools generate:pages
 *   pnpm --filter @quasar-testing-harness/tools generate:pages -- --only QBtn,QInput
 */
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync
} from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const APP_PROPS_DIR =
  process.env.APP_PROPS_DIR ||
  join(__dirname, '..', '..', 'app', 'src', 'components', 'props')

const APP_PAGES_DIR =
  process.env.APP_PAGES_DIR ||
  join(__dirname, '..', '..', 'app', 'src', 'pages')

const MANIFEST_PATH =
  process.env.MANIFEST_PATH ||
  join(__dirname, '..', '..', 'app', 'src', 'router', 'components.ts')

/** Quasar kebab-case tag for each component name. */
const TAG_OVERRIDES: Record<string, string> = {
  QBtnDropdown: 'q-btn-dropdown',
  QBtnGroup: 'q-btn-group',
  QBtnToggle: 'q-btn-toggle',
  QCircularProgress: 'q-circular-progress',
  QExpansionItem: 'q-expansion-item',
  QInfiniteScroll: 'q-infinite-scroll',
  QInnerLoading: 'q-inner-loading',
  QLinearProgress: 'q-linear-progress',
  QMarkupTable: 'q-markup-table',
  QNoSsr: 'q-no-ssr',
  QOptionGroup: 'q-option-group',
  QPageScroller: 'q-page-scroller',
  QPageSticky: 'q-page-sticky',
  QPullToRefresh: 'q-pull-to-refresh',
  QScrollArea: 'q-scroll-area',
  QSlideItem: 'q-slide-item',
  QTabPanels: 'q-tab-panels'
}

function tagFor(name: string): string {
  return TAG_OVERRIDES[name] || `q-${name.replace(/^Q/, '').toLowerCase()}`
}

function readManifest(): Array<{ name: string; slug: string }> {
  if (!existsSync(MANIFEST_PATH)) {
    console.error(`Manifest not found: ${MANIFEST_PATH}`)
    process.exit(1)
  }
  const src = readFileSync(MANIFEST_PATH, 'utf-8')
  const m = src.matchAll(/name:\s*'([^']+)'.*?slug:\s*'([^']+)'/gs)
  return Array.from(m, (x) => ({ name: x[1], slug: x[2] }))
}

function renderPage(name: string, slug: string): string {
  const tag = tagFor(name)
  const varName = name[0].toLowerCase() + name.slice(1)
  return `<script lang="ts">
export default {
  name: '${name}Page'
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ControlPanel from '../../components/ControlPanel.vue'
import {
  ${varName}Defaults,
  ${varName}Schema
} from '../../components/props/${name}Props'
import { useQueryProps } from '../../composables/useQueryProps'

const { props, setProp, reset } = useQueryProps<Record<string, unknown>>({
  defaults: ${varName}Defaults as unknown as Record<string, unknown>
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
    <h1 style="font-size: 20px; margin: 0 0 4px">${name}</h1>
    <p style="color: #666; margin: 0 0 16px">
      Route <code>/${slug}</code> — props driven by URL query string.
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
      <${tag} v-bind="boundProps" />
    </div>

    <ControlPanel
      :schema="${varName}Schema"
      :model-value="props"
      title="${name}"
      @update:model-value="onUpdate"
      @reset="reset"
    />
  </q-page>
</template>
`
}

function main() {
  const args = process.argv.slice(2)
  const onlyIdx = args.indexOf('--only')
  const only = onlyIdx >= 0 ? new Set(args[onlyIdx + 1].split(',')) : null

  const manifest = readManifest()
  mkdirSync(APP_PAGES_DIR, { recursive: true })

  let generated = 0
  let skipped = 0
  for (const { name, slug } of manifest) {
    if (only && !only.has(name)) {
      skipped++
      continue
    }
    const schemaPath = join(APP_PROPS_DIR, `${name}Props.ts`)
    if (!existsSync(schemaPath)) {
      console.warn(`⚠ ${name}: no schema at ${schemaPath}, skipping`)
      skipped++
      continue
    }
    const outDir = join(APP_PAGES_DIR, slug)
    mkdirSync(outDir, { recursive: true })
    const outPath = join(outDir, `${name}Page.vue`)
    writeFileSync(outPath, renderPage(name, slug), 'utf-8')
    console.log(`✓ ${name} → ${outPath}`)
    generated++
  }

  console.log(`\n${generated} generated, ${skipped} skipped`)
}

main()
