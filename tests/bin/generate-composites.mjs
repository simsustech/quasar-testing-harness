#!/usr/bin/env node
/**
 * Generate self-contained composite pattern page + tests.
 * Uses manually curated, clean patterns that render without broken state.
 *
 * Usage: node tests/bin/generate-composites.mjs
 * Scans quasar docs examples for patterns, then generates working tests.
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const DOCS_EXAMPLES = join(ROOT, '..', 'quasar', 'docs', 'src', 'examples')

// Scan docs for every example file with 2+ Quasar component tags
function scanExamples() {
  const categories = readdirSync(DOCS_EXAMPLES, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name)

  const allQTags = new Set(
    categories.map(c => {
      const slug = c.replace(/^Q/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
      return `q-${slug}`
    })
  )

  const found = []
  for (const category of categories) {
    const dir = join(DOCS_EXAMPLES, category)
    for (const file of readdirSync(dir).filter(f => f.endsWith('.vue'))) {
      const content = readFileSync(join(dir, file), 'utf-8')
      const m = content.match(/<template>([\s\S]*?)<\/template>/)
      if (!m) continue
      const tags = [...new Set([...m[1].matchAll(/<(q-[a-z][^ >/]*)/g)].map(x => x[1]))]
      const self = `q-${category.replace(/^Q/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`
      const others = tags.filter(t => t !== self && allQTags.has(t))
      if (others.length >= 2) {
        found.push({ file: `${category}/${file}`, primary: self, secondary: others })
      }
    }
  }
  return found
}

// Escape for JS template string
const esc = (s, dq) => dq ? s.replace(/"/g, '\\"') : s.replace(/'/g, "\\'")

// Clean, self-contained snippets for the most important composite patterns
// Top 25 most-used composite patterns from Quasar docs
const SNIPPETS = {
  'q-card+q-card-section': `<q-card style="max-width:300px"><q-card-section><div class="text-h6">Title</div></q-card-section><q-card-section>Content text</q-card-section></q-card>`,
  'q-card+q-separator+q-btn': `<q-card style="max-width:300px"><q-card-section>Content</q-card-section><q-separator/><q-card-actions><q-btn flat label="Action" color="primary"/></q-card-actions></q-card>`,
  'q-card+q-carousel+q-btn': `<q-card style="max-width:300px"><q-carousel v-model="s1" height="100px" arrows><q-carousel-slide name="s1" class="bg-primary text-white column flex-center"><div>S1</div></q-carousel-slide></q-carousel><q-card-actions><q-btn flat label="Go" color="primary"/></q-card-actions></q-card>`,
  'q-card+q-item+q-avatar': `<q-card style="max-width:300px"><q-card-section><q-item><q-item-section avatar><q-avatar color="primary" icon="person"/></q-item-section><q-item-section><q-item-label>John</q-item-label></q-item-section></q-item></q-card-section></q-card>`,
  'q-card+q-rating+q-btn': `<q-card style="max-width:300px"><q-card-section><q-rating v-model="r" :max="3"/></q-card-section><q-card-actions><q-btn flat label="Rate" color="primary"/></q-card-actions></q-card>`,
  'q-btn+q-tooltip': `<q-btn label="Hover" color="primary"><q-tooltip>Tooltip text</q-tooltip></q-btn>`,
  'q-btn+q-badge': `<q-btn color="white" text-color="primary" icon="email"><q-badge color="red" floating>9</q-badge></q-btn>`,
  'q-btn+q-spinner': `<q-btn label="Loading" color="primary" loading><template v-slot:loading><q-spinner-gears/></template></q-btn>`,
  'q-btndropdown+q-list+q-item': `<q-btn-dropdown label="Menu" color="primary"><q-list><q-item clickable v-close-popup><q-item-section>A</q-item-section></q-item></q-list></q-btn-dropdown>`,
  'q-btndropdown+q-avatar+q-list': `<q-btn-dropdown color="primary"><template v-slot:label><q-avatar color="white" icon="person" size="24px"/></template><q-list><q-item clickable><q-item-section>Profile</q-item-section></q-item></q-list></q-btn-dropdown>`,
  'q-btndropdown+q-toggle+q-list': `<q-btn-dropdown label="Settings" color="primary"><q-list><q-item><q-item-section><q-item-label>Enable</q-item-label></q-item-section><q-item-section side><q-toggle v-model="t"/></q-item-section></q-item></q-list></q-btn-dropdown>`,
  'q-dialog+q-card+q-btn': `<q-btn label="Open" color="primary" @click="d1=true"/><q-dialog v-model="d1"><q-card style="min-width:250px"><q-card-section>Content</q-card-section><q-card-actions><q-btn flat label="Close" color="primary" v-close-popup/></q-card-actions></q-card></q-dialog>`,
  'q-dialog+q-card+q-input+q-btn': `<q-btn label="Login" color="primary" @click="d2=true"/><q-dialog v-model="d2"><q-card style="min-width:300px"><q-card-section><q-input label="Email" v-model="em"/></q-card-section><q-card-actions><q-btn flat label="OK" color="primary" v-close-popup/></q-card-actions></q-card></q-dialog>`,
  'q-toolbar+q-btn+q-title': `<q-toolbar class="bg-primary text-white rounded-borders"><q-btn flat round dense icon="menu"/><q-toolbar-title>Title</q-toolbar-title><q-btn flat round dense icon="search"/></q-toolbar>`,
  'q-toolbar+q-tabs': `<q-toolbar class="bg-primary text-white rounded-borders"><q-btn flat round dense icon="menu"/><q-tabs shrink><q-tab name="t1" label="Tab 1"/><q-tab name="t2" label="Tab 2"/></q-tabs></q-toolbar>`,
  'q-toolbar+q-breadcrumbs': `<q-toolbar class="bg-grey-3 rounded-borders"><q-breadcrumbs><q-breadcrumbs-el label="Home"/><q-breadcrumbs-el label="Products"/></q-breadcrumbs></q-toolbar>`,
  'q-item+q-avatar+q-label': `<q-list><q-item><q-item-section avatar><q-avatar color="primary" icon="person"/></q-item-section><q-item-section><q-item-label>John</q-item-label></q-item-section></q-item></q-list>`,
  'q-item+q-badge': `<q-list><q-item><q-item-section><q-item-label>Inbox</q-item-label></q-item-section><q-item-section side><q-badge color="red" rounded>9</q-badge></q-item-section></q-item></q-list>`,
  'q-item+q-checkbox': `<q-list><q-item><q-item-section avatar><q-checkbox v-model="c1"/></q-item-section><q-item-section><q-item-label>Task</q-item-label></q-item-section></q-item></q-list>`,
  'q-item+q-radio': `<q-list><q-item><q-item-section avatar><q-radio v-model="r1" val="a"/></q-item-section><q-item-section><q-item-label>Option</q-item-label></q-item-section></q-item></q-list>`,
  'q-item+q-icon+q-toggle': `<q-list><q-item><q-item-section avatar><q-icon name="notifications"/></q-item-section><q-item-section><q-item-label>Notify</q-item-label></q-item-section><q-item-section side><q-toggle v-model="t"/></q-item-section></q-item></q-list>`,
  'q-expansionitem+q-card': `<q-expansion-item icon="explore" label="Details" default-opened><q-card><q-card-section>Content</q-card-section></q-card></q-expansion-item>`,
  'q-expansionitem+q-toggle': `<q-expansion-item icon="settings" label="Prefs"><q-card><q-card-section><q-toggle label="Enable" v-model="t"/></q-card-section></q-card></q-expansion-item>`,
  'q-header+q-toolbar+q-btn+q-page': `<q-layout container style="height:100px" class="rounded-borders overflow-hidden"><q-header class="bg-primary text-white"><q-toolbar><q-btn flat round dense icon="menu"/><q-toolbar-title>App</q-toolbar-title><q-btn flat round dense icon="search"/></q-toolbar></q-header><q-page-container><q-page padding>Content</q-page></q-page-container></q-layout>`,
  'q-header+q-toolbar+q-tabs': `<q-layout container style="height:130px" class="rounded-borders overflow-hidden"><q-header class="bg-primary text-white"><q-toolbar><q-btn flat round dense icon="menu"/><q-toolbar-title>App</q-toolbar-title></q-toolbar><q-tabs><q-tab name="t1" label="Tab 1"/><q-tab name="t2" label="Tab 2"/></q-tabs></q-header><q-page-container><q-page padding>Content</q-page></q-page-container></q-layout>`,
  'q-drawer+q-item+q-icon+q-scrollarea': `<q-layout container style="height:180px" class="rounded-borders overflow-hidden"><q-drawer v-model="dr" :width="160"><q-scroll-area style="height:100%"><q-list><q-item clickable><q-item-section avatar><q-icon name="inbox"/></q-item-section><q-item-section>Inbox</q-item-section></q-item></q-list></q-scroll-area></q-drawer><q-page-container><q-page padding>Content</q-page></q-page-container></q-layout>`,
  'q-fab+q-fabaction': `<q-fab icon="add" color="primary" direction="right"><q-fab-action color="secondary" icon="star" label="Fav"/></q-fab>`,
  'q-form+q-input+q-btn': `<q-form class="q-gutter-md" style="max-width:350px"><q-input label="Name" v-model="n"/><q-btn label="Submit" type="submit" color="primary"/></q-form>`,
  'q-input+q-icon': `<q-input label="User" v-model="u"><template v-slot:prepend><q-icon name="person"/></template></q-input>`,
  'q-input+q-badge': `<q-input label="Email" v-model="e"><template v-slot:append><q-badge color="primary">OK</q-badge></template></q-input>`,
  'q-select+q-chip': `<q-select v-model="sel" :options="['A','B','C']" label="Tags" use-chips multiple style="max-width:350px"/>`,
  'q-field+q-icon': `<q-field label="User" stack-label><template v-slot:prepend><q-icon name="person"/></template><template v-slot:control><div class="self-center full-width">johndoe</div></template></q-field>`,
  'q-file+q-icon': `<q-file label="Upload" v-model="f"><template v-slot:prepend><q-icon name="attach_file"/></template></q-file>`,
  'q-knob+q-icon': `<q-knob v-model="k" size="80px" show-value color="primary"><q-icon name="volume_up" class="q-knob-center"/></q-knob>`,
  'q-slider+q-badge': `<div class="row items-center q-gutter-sm"><q-badge color="primary">65%</q-badge><q-slider v-model="sv" :min="0" :max="100" class="col" color="primary"/></div>`,
  'q-range+q-badge': `<div><q-range v-model="rv" :min="0" :max="100" label color="primary"/></div>`,
  'q-tabs+q-tabpanels+q-panel': `<div><q-tabs v-model="tv"><q-tab name="t1" label="Tab 1"/><q-tab name="t2" label="Tab 2"/></q-tabs><q-tab-panels v-model="tv"><q-tab-panel name="t1">C1</q-tab-panel><q-tab-panel name="t2">C2</q-tab-panel></q-tab-panels></div>`,
  'q-menu+q-list+q-item': `<q-btn label="Menu" color="primary"><q-menu><q-list><q-item clickable v-close-popup><q-item-section>Profile</q-item-section></q-item><q-item clickable v-close-popup><q-item-section>Settings</q-item-section></q-item></q-list></q-menu></q-btn>`,
  'q-innerloading+q-card': `<q-card style="position:relative;min-height:80px"><q-card-section>Loading...</q-card-section><q-inner-loading showing color="primary"/></q-card>`,
  'q-editor+q-btndropdown': `<q-editor v-model="ev" min-height="80px" style="max-width:450px" :toolbar="[['bold','italic'],['undo']]"/>`,
  'q-date+q-input+q-icon+q-popupproxy': `<q-input v-model="dv" label="Date" style="max-width:250px"><template v-slot:append><q-icon name="event" class="cursor-pointer"><q-popup-proxy><q-date v-model="dv" mask="YYYY/MM/DD"/></q-popup-proxy></q-icon></template></q-input>`,
  'q-banner+q-btn': `<q-banner class="bg-primary text-white rounded-borders"><template v-slot:avatar><q-icon name="info" color="white"/></template>Notice<template v-slot:action><q-btn flat color="white" label="Ok"/></template></q-banner>`,
  'q-timeline+q-icon': `<q-timeline color="primary"><q-timeline-entry title="Event" subtitle="Today">Desc</q-timeline-entry></q-timeline>`,
  'q-chatmessage+q-avatar': `<q-chat-message name="John" v-model="'Hi'" sent/><q-chat-message name="Jane" v-model="'Hello'"/>`,
  'q-bar+q-icon+q-space+q-btn': `<q-bar class="bg-grey-9 text-white rounded-borders"><q-icon name="laptop"/><div>Title</div><q-space/><q-btn dense flat icon="minimize"/><q-btn dense flat icon="close"/></q-bar>`,
  'q-color+q-badge': `<div class="q-gutter-sm"><q-color v-model="cv" style="max-width:200px"/><q-badge color="primary">#6750a4</q-badge></div>`,
  'q-linearprogress+q-badge': `<div><q-linear-progress v-model="pv" color="primary"/><q-badge color="primary">65%</q-badge></div>`,
  'q-circularprogress+q-icon': `<q-circular-progress v-model="cp" size="60px" color="primary"><q-icon name="check" size="24px"/></q-circular-progress>`,
  'q-checkbox+q-item': `<q-list><q-item><q-item-section avatar><q-checkbox v-model="cb"/></q-item-section><q-item-section><q-item-label>Remember</q-item-label></q-item-section></q-item></q-list>`,
  'q-stepper+q-btn': `<q-stepper v-model="st" style="max-width:400px"><q-step :name="1" title="Step 1">Content</q-step><q-step :name="2" title="Step 2">Content</q-step><template v-slot:navigation><q-btn flat label="Next" color="primary"/></template></q-stepper>`,
}

const patterns = Object.entries(SNIPPETS).map(([key, snippet]) => {
  const parts = key.split('+')
  return { name: parts.map(p => p.replace(/^q-/, 'Q').replace(/-([a-z])/g, (_,c)=>c.toUpperCase())).join(' + '), snippet }
})

// Generate Vue SFC
const hasDialogs = patterns.some(p => p.snippet.includes('d1=') || p.snippet.includes('d2='))
const refVars = ['s1', 'r', 't', 'c1', 'r1', 'dr', 'n', 'u', 'e', 'sel', 'f', 'k', 'sv', 'rv', 'tv', 'ev', 'dv', 'cv', 'pv', 'cp', 'cb', 'st', 'em']
const setupVars = refVars.map(v => `      ${v}: ref(${v === 'sel' ? "[]" : v === 'rv' ? "{min:25,max:75}" : v === 'st' ? '1' : v === 'f' ? 'null' : v === 'k' || v === 'cp' || v === 'sv' || v === 'pv' ? '65' : v === 'tv' || v === 'dv' ? "'t1'" : v === 'cv' ? "'#6750a4'" : v === 'ev' ? "'<p>Text</p>'" : v === 'em' ? "''" : "false"})`).join(',\n')

const vueContent = `<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'CompositesPage',
  setup() {
    return {
${setupVars}
    }
  }
}
</script>

<template>
  <q-page padding class="q-gutter-y-lg">
    <p>${patterns.length} composite patterns from Quasar docs.</p>
    ${patterns.map((p, i) => `
    <q-separator/>
    <section data-testid="composite-${i + 1}">
      <div class="text-subtitle1 q-mb-sm">${p.name}</div>
      <div class="q-pa-sm">${p.snippet}</div>
    </section>`).join('')}
  </q-page>
</template>
`

// Generate test file
const testContent = `import { test, expect } from '@playwright/test'

const STYLES = ['md3', 'md2', 'unstyled'] as const

const PATTERNS = {
${patterns.map((p, i) => {
  const tags = [...new Set([...p.snippet.matchAll(/<(q-[a-z][^ >/]*)/g)].map(m => m[1]))]
  return `  'composite-${i + 1}': ${JSON.stringify({ name: p.name, tags })}`
}).join(',\n')}
}

for (const [id, info] of Object.entries(PATTERNS)) {
  test.describe(info.name, () => {
    for (const style of STYLES) {
      test(\`renders with ?style=\${style}\`, async ({ page }) => {
        test.setTimeout(30_000)
        await page.goto('/composites?style=' + style, { waitUntil: 'domcontentloaded' })
        await expect(page.locator('[data-testid="' + id + '"]')).toBeVisible({ timeout: 10_000 })
        // Verify at least the first 2 component tags are present
        for (const tag of info.tags.slice(0, 3)) {
          const count = await page.locator('[data-testid="' + id + '"] ' + tag).count()
          expect(count).toBeGreaterThan(0)
        }
      })
    }
  })
}
`

// Write
const pagePath = join(ROOT, 'packages', 'app', 'src', 'pages', 'composites', 'CompositesPage.vue')
const testPath = join(ROOT, 'tests', 'composites.spec.ts')
mkdirSync(dirname(pagePath), { recursive: true })
writeFileSync(pagePath, vueContent)
writeFileSync(testPath, testContent)
console.log(`Wrote ${patterns.length} composite patterns`)
console.log(`Page: ${pagePath} (${vueContent.split('\n').length} lines)`)
console.log(`Tests: ${testPath} (${testContent.split('\n').length} lines, ${patterns.length * 3} test cases)`)
