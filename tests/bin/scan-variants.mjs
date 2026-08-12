#!/usr/bin/env node
/**
 * Scan component test coverage and cross-reference against:
 * 1. Quasar docs examples — prop combos shown in documentation
 * 2. Quasar UI source code (quasar/ui/src/components) — available props
 *
 * Usage: node tests/bin/scan-variants.mjs
 * Reports coverage gaps for both prop variations and spec conformance.
 */
import { readdirSync, readFileSync, existsSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', '..')
const QUASAR_UI = join(ROOT, '..', 'quasar', 'ui', 'src', 'components')
const DOCS_EXAMPLES = join(ROOT, '..', 'quasar', 'docs', 'src', 'examples')

// --- Utilities ---
function slugify(name) {
  return (
    'q-' +
    name
      .replace(/^Q/, '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()
  )
}

function camelToKebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

function pascalToKebab(str) {
  return str
    .replace(/^Q/, '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

// --- 1. Read Quasar UI source for component prop definitions ---
function readSourceProps() {
  if (!existsSync(QUASAR_UI)) return {}

  const sourceProps = {}
  for (const dir of readdirSync(QUASAR_UI, { withFileTypes: true }).filter(
    (d) => d.isDirectory()
  )) {
    const slug = slugify(dir.name)
    const pascalName =
      dir.name.charAt(0).toUpperCase() +
      dir.name.slice(1).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const jsonFile = join(QUASAR_UI, dir.name, `Q${pascalName}.json`)
    const vueFile = join(QUASAR_UI, dir.name, `${dir.name}.vue`)
    const jsFile = join(QUASAR_UI, dir.name, `${dir.name}.js`)
    const tsFile = join(QUASAR_UI, dir.name, `${dir.name}.ts`)

    // Try JSON API definitions first (Quasar's canonical prop definitions)
    if (existsSync(jsonFile)) {
      try {
        const json = JSON.parse(readFileSync(jsonFile, 'utf-8'))
        const props = json.props || json.def?.props || {}
        sourceProps[slug] = {
          props: Object.keys(props).map((k) => camelToKebab(k)),
          categories: [
            ...new Set(Object.values(props).map((p) => p.category || 'other'))
          ]
        }
        continue
      } catch {
        /* fall through */
      }
    }

    // Fall back to scanning the component source for `props:` definitions
    const srcFile = [vueFile, jsFile, tsFile].find((f) => existsSync(f))
    if (srcFile) {
      const content = readFileSync(srcFile, 'utf-8')
      const propNames = [...content.matchAll(/['"](\w+)['"]\s*:\s*\{/g)]
        .map((m) => m[1])
        .filter(
          (n) =>
            n !== 'props' &&
            !['type', 'default', 'required', 'validator'].includes(n)
        )
      sourceProps[slug] = {
        props: [...new Set(propNames)],
        categories: []
      }
    }
  }
  return sourceProps
}

// --- 2. Read all component spec files ---
function readSpecs() {
  const specsDir = join(ROOT, 'tests', 'components')
  const specs = {}
  for (const f of readdirSync(specsDir).filter((f) => f.endsWith('.spec.ts'))) {
    const content = readFileSync(join(specsDir, f), 'utf-8')
    const slug = content.match(/const\s+SLUG\s*=\s*'([^']+)'/)?.[1]
    if (!slug) continue

    // Extract prop variation labels
    const labels = []
    const variantMatch = content.match(
      /const\s+variants\s*=\s*\[([\s\S]*?)\]\s*\n\s*\n\s*test/
    )
    if (variantMatch) {
      const block = variantMatch[1]
      for (const m of block.matchAll(/label:\s*'([^']+)'/g)) {
        labels.push(m[1])
      }
    }

    // Extract query params from variants to find which Quasar props are actually tested
    const testedQuasarProps = new Set()
    const queryMatch = content.match(/query:\s*'([^']+)'/g)
    if (queryMatch) {
      for (const q of queryMatch) {
        const params = q.match(/query:\s*'([^']+)'/)?.[1]?.split('&') || []
        for (const p of params) {
          const key = p.split('=')[0]
          if (key && key !== 'style') testedQuasarProps.add(key)
        }
      }
    }

    // Extract conformance test names
    const conformance = []
    const describeBlocks = content.matchAll(
      /test\.describe\('([^']+)(?:conformance|spec conformance)([^']*)'/gi
    )
    for (const m of describeBlocks) {
      const blockName = m[0]
      const tests = [
        ...content
          .slice(content.indexOf(blockName))
          .matchAll(/test\('([^']+)'/g)
      ].map((t) => t[1])
      conformance.push(...tests)
    }

    specs[slug] = {
      file: f,
      labels,
      testedProps: [...testedQuasarProps],
      conformance,
      hasVariants: labels.length > 0
    }
  }
  return specs
}

// --- 3. Read Quasar docs examples ---
function readDocExamples() {
  if (!existsSync(DOCS_EXAMPLES)) return {}

  const docMap = {}
  for (const dir of readdirSync(DOCS_EXAMPLES, { withFileTypes: true }).filter(
    (d) => d.isDirectory()
  )) {
    const slug = slugify(dir.name)
    const examples = []
    for (const f of readdirSync(join(DOCS_EXAMPLES, dir.name)).filter((f) =>
      f.endsWith('.vue')
    )) {
      const content = readFileSync(join(DOCS_EXAMPLES, dir.name, f), 'utf-8')
      const template =
        content.match(/<template>([\s\S]*?)<\/template>/)?.[1] || ''

      // Extract props on all occurrences of the primary component tag
      const props = new Set()
      const tagPattern = new RegExp(`<${slug}(?:\\s[^>]*)?>`, 'gi')
      for (const tm of template.matchAll(tagPattern)) {
        const attrs =
          tm[0].match(new RegExp(`<${slug}\\s+(.*?)(?:/|)>`, 'i'))?.[1] || ''
        for (const a of attrs.matchAll(/([a-z][a-z-]*)(?:="[^"]*"|)/gi)) {
          const prop = a[1]
          if (
            [
              'class',
              'style',
              ':key',
              'v-for',
              'v-if',
              'v-else',
              'v-show',
              'ref',
              'v-close-popup',
              'v-ripple',
              'slot'
            ].includes(prop)
          )
            continue
          if (prop.startsWith('@') || prop.startsWith('v-')) continue
          props.add(prop)
        }
      }
      examples.push({ file: f, props: [...props] })
    }
    if (examples.length > 0) docMap[slug] = examples
  }
  return docMap
}

// --- 4. Report ---
const specs = readSpecs()
const docExamples = readDocExamples()
const sourceProps = readSourceProps()

console.log('=== Component test coverage report ===')
console.log()

const allSlugs = [
  ...new Set([
    ...Object.keys(specs),
    ...Object.keys(docExamples),
    ...Object.keys(sourceProps)
  ])
].sort()

let fullyCovered = 0
let withGaps = 0
let noSpec = 0

for (const slug of allSlugs) {
  const spec = specs[slug]
  const docs = docExamples[slug] || []
  const source = sourceProps[slug]
  const numLabels = spec?.labels?.length || 0
  const numDocs = docs.length
  const numProps = source?.props?.length || 0
  const numTestedProps = spec?.testedProps?.length || 0
  const numConformance = spec?.conformance?.length || 0

  if (!spec) {
    const componentName = slug.replace(/^q-/, '')
    console.log(`  ?? ${slug} — no spec file`)
    noSpec++
    continue
  }

  // Check how many Quasar props are exercised by the variant tests
  const sourcePropSet = new Set(source?.props || [])
  const testedPropSet = new Set(spec.testedProps.map((p) => camelToKebab(p)))
  const untestedSourceProps = [...sourcePropSet].filter(
    (p) =>
      !testedPropSet.has(p) &&
      !['dark', 'dense', 'disable', 'readonly', 'loading'].includes(p)
  )

  // Check untested doc examples
  const testedLabels = new Set(
    spec.labels.map((l) => l.toLowerCase().replace(/[^a-z0-9]/g, ''))
  )
  const untestedDocs = docs.filter((d) => {
    const base = d.file
      .replace(/\.vue$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
    return ![...testedLabels].some(
      (label) => base.includes(label) || label.includes(base)
    )
  })

  const hasGaps = untestedDocs.length > 0

  if (hasGaps) {
    console.log(
      `  ~ ${slug} — ${numLabels} variants, ${numConformance} conformance tests`
    )
    console.log(
      `    Quasar source: ${numProps} props (${numTestedProps} tested, ${untestedSourceProps.length} uncovered)`
    )
    console.log(
      `    Doc examples: ${numDocs} total — ${untestedDocs.length} untested:`
    )
    for (const d of untestedDocs.slice(0, 6)) {
      console.log(
        `      ✗ ${d.file} — props: ${d.props.slice(0, 6).join(', ')}${d.props.length > 6 ? '...' : ''}`
      )
    }
    if (untestedDocs.length > 6)
      console.log(`      ... and ${untestedDocs.length - 6} more`)
    withGaps++
  } else {
    console.log(
      `  ✓ ${slug} — ${numLabels} variants, ${numConformance} conformance, ${numDocs} doc examples covered`
    )
    fullyCovered++
  }
}

console.log()
console.log('=== Summary ===')
console.log(`  Components with specs: ${Object.keys(specs).length}`)
console.log(`  ✓ Fully covered: ${fullyCovered}`)
console.log(`  ~ With gaps: ${withGaps}`)
console.log(`  ?? No spec file: ${noSpec}`)
console.log()
console.log('=== Quick wins (high coverage gap) ===')
const gapRanking = Object.entries(specs)
  .map(([slug, s]) => {
    const docs = docExamples[slug] || []
    const untested = docs.filter((d) => {
      const base = d.file
        .replace(/\.vue$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
      const labels = new Set(
        s.labels.map((l) => l.toLowerCase().replace(/[^a-z0-9]/g, ''))
      )
      return ![...labels].some(
        (label) => base.includes(label) || label.includes(base)
      )
    })
    return {
      slug,
      labels: s.labels.length,
      untested: untested.length,
      total: docs.length
    }
  })
  .filter((r) => r.untested > 0)
  .sort((a, b) => b.untested - a.untested)
  .slice(0, 15)

for (const r of gapRanking) {
  console.log(
    `  ${r.slug}: ${r.labels} variants tested, ${r.untested}/${r.total} doc examples uncovered`
  )
}

console.log()
console.log('=== How to use ===')
console.log('1. Run this script to find gaps')
console.log('2. For each ~ component, add variant tests to its spec file')
console.log(
  '3. Use the props listed from the doc files to construct URL query params'
)
console.log('4. Re-run the script to verify coverage improved')
