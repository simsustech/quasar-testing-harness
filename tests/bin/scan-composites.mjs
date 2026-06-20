#!/usr/bin/env node
/**
 * Scan every Quasar docs example file and report composite patterns
 * (components nested inside other components) that aren't yet tested.
 *
 * Usage: node tests/bin/scan-composites.mjs
 * Reports: which composites are missing from composites.spec.ts &
 *          the CompositesPage.vue
 */
import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')

// Paths
const DOCS_EXAMPLES = join(ROOT, '..', 'quasar', 'docs', 'src', 'examples')
const COMPOSITES_PAGE = join(ROOT, 'packages', 'app', 'src', 'pages', 'composites', 'CompositesPage.vue')
const COMPOSITES_TEST = join(ROOT, 'tests', 'composites.spec.ts')

// --- 1. Read what's already tested ---
function readTestedPatterns() {
  const patterns = new Set()
  if (existsSync(COMPOSITES_TEST)) {
    const content = readFileSync(COMPOSITES_TEST, 'utf-8')
    // Extract test description names
    for (const m of content.matchAll(/test\.describe\('([^']+)'/g)) {
      patterns.add(m[1])
    }
  }
  return patterns
}

// --- 2. Scan docs examples ---
function scanDocsExamples() {
  const categories = readdirSync(DOCS_EXAMPLES, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  // Quasar component tag names (lowercase)
  const qTags = new Set(categories.map(c => `q-${c.replace(/^Q/, '').toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`))

  const composites = [] // { primary, secondary, file, components[] }

  for (const category of categories) {
    const dir = join(DOCS_EXAMPLES, category)
    const files = readdirSync(dir).filter(f => f.endsWith('.vue'))

    for (const file of files) {
      const content = readFileSync(join(dir, file), 'utf-8')
      const tags = [...content.matchAll(/<(q-[a-z][^ >/]*)/g)].map(m => m[1])
      const unique = [...new Set(tags)]

      // Skip if only 1 component tag
      if (unique.length < 2) continue

      // Component name of this category (e.g. QBtn -> q-btn)
      const primary = `q-${category.replace(/^Q/, '').toLowerCase().replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`
      const others = unique.filter(t => t !== primary && qTags.has(t))

      if (others.length > 0) {
        composites.push({
          primary,
          secondary: others,
          file: `${category}/${file}`,
          raw: unique
        })
      }
    }
  }

  return composites
}

// --- 3. Group by primary-secondary pair ---
function groupByPair(composites) {
  const pairs = new Map() // "primary+secondary" -> { files[], count }
  for (const c of composites) {
    const key = `${c.primary}+${c.secondary.join(',')}`
    if (!pairs.has(key)) {
      pairs.set(key, {
        primary: c.primary,
        secondary: c.secondary,
        files: []
      })
    }
    pairs.get(key).files.push(c.file)
  }
  return [...pairs.values()]
}

function slug(name) {
  return name.replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

// --- Main ---
const tested = readTestedPatterns()
const all = scanDocsExamples()
const pairs = groupByPair(all)

console.log('=== Composite patterns found in Quasar docs ===')
console.log(`Total unique composite pairs: ${pairs.length}\n`)

const relevant = pairs.filter(p => p.secondary.length >= 2)
console.log('=== Patterns with 2+ secondary components (most valuable) ===')
for (const p of relevant) {
  const desc = `${p.primary} + ${p.secondary.join(', ')}`
  const testedStr = [...tested].find(t => t.toLowerCase().includes(p.primary.replace('q-', ''))) ? '✓' : '✗'
  console.log(`  ${testedStr} ${desc}`)
  console.log(`     Files: ${p.files.slice(0, 3).join(', ')}${p.files.length > 3 ? ` (+${p.files.length - 3} more)` : ''}`)
}
console.log()

// Untested pairs (with 2+ secondary)
const untested = relevant.filter(p => {
  const desc = p.primary.replace('q-', '')
  return ![...tested].some(t => t.toLowerCase().includes(desc))
})

console.log(`=== Untested composite patterns (${untested.length}) ===`)
for (const p of untested.slice(0, 30)) {
  console.log(`  ${p.primary} + ${p.secondary.join(', ')}`)
  console.log(`    e.g. ${p.files[0]}`)
}
console.log()

// All unique component pairs (primary + one secondary)
console.log('=== All unique component pairs ===')
const componentPairs = new Set()
for (const c of all) {
  for (const s of c.secondary) {
    componentPairs.add(`${c.primary} + ${s}`)
  }
}
for (const pair of [...componentPairs].sort()) {
  const testedStr = [...tested].some(t => {
    const parts = pair.split(' + ')
    return t.toLowerCase().includes(parts[0].replace('q-', '')) &&
           t.toLowerCase().includes(parts[1].replace('q-', ''))
  }) ? '✓' : '✗'
  console.log(`  ${testedStr} ${pair}`)
}
