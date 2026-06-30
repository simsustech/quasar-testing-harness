#!/usr/bin/env node
/**
 * Generate Q{Name}Props.ts files for every Quasar component.
 *
 * Single source of truth: the merged, public Quasar docs JSONs at
 *   ~/Projects/quasar/docs/public/quasar-api/Q{Name}.json
 *
 * Each JSON has the final, mixed-in prop list with types, defaults, values,
 * and descriptions. We map them to a PropSchema[] suitable for the
 * ControlPanel.
 *
 * Usage:
 *   pnpm --filter @quasar-testing-harness/tools generate:props
 *   pnpm --filter @quasar-testing-harness/tools generate:props -- --only QBtn,QInput
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const QUASAR_API_DIR =
  process.env.QUASAR_API_DIR ||
  '/home/stefan/Projects/quasar/docs/public/quasar-api'

const APP_PROPS_DIR =
  process.env.APP_PROPS_DIR ||
  join(__dirname, '..', '..', 'app', 'src', 'components', 'props')

const MANIFEST_PATH =
  process.env.MANIFEST_PATH ||
  join(__dirname, '..', '..', 'app', 'src', 'router', 'components.ts')

type PropType = 'string' | 'number' | 'boolean' | 'select'

interface QuasarProp {
  type?: string | string[]
  tsType?: string
  default?: unknown
  values?: string[]
  desc?: string
  category?: string
  required?: boolean
  examples?: string[]
  addedIn?: string
  extends?: string
}

interface QuasarApiJson {
  type?: string
  meta?: { docsUrl?: string; category?: string }
  props?: Record<string, QuasarProp>
  slots?: Record<string, unknown>
  events?: Record<string, unknown>
  methods?: Record<string, unknown>
}

/**
 * Map a Quasar prop type to our control type.
 * - "Boolean" → boolean
 * - "Number" → number
 * - "String" with values[] → select
 * - everything else → string
 */
function mapType(prop: QuasarProp): PropType {
  if (prop.extends) return 'string'
  const t = Array.isArray(prop.type) ? prop.type.join('|') : prop.type
  if (t === 'Boolean') return 'boolean'
  if (t === 'Number') return 'number'
  if (prop.values && prop.values.length > 0) return 'select'
  return 'string'
}

/** Clean up Quasar's quoted default like "'button'" → "button" */
function cleanDefault(raw: unknown): string | number | boolean | unknown[] | Record<string, unknown> {
  if (raw === null || raw === undefined) return ''
  if (typeof raw === 'boolean' || typeof raw === 'number') return raw
  if (typeof raw === 'string') {
    let s = raw.trim()
    // strip surrounding quotes
    if (
      (s.startsWith("'") && s.endsWith("'")) ||
      (s.startsWith('"') && s.endsWith('"'))
    ) {
      s = s.slice(1, -1)
    }
    // "true"/"false" → boolean
    if (s === 'true') return true
    if (s === 'false') return false
    if (s === 'null') return ''
    // Comment-like defaults from Quasar docs ("# hard-coded palette") → empty
    if (s.startsWith('#')) return ''
    // Array- or object-like defaults ("[ 5, 7, 10 ]" or "{ min: 0, max: 0 }") → parse
    if (s.startsWith('[') || s.startsWith('{')) {
      try {
        const parsed = JSON.parse(s)
        if (Array.isArray(parsed) || typeof parsed === 'object') return parsed
      } catch {
        // If JSON parse fails, try replacing single-quoted strings with double quotes
        // to handle JS-style defaults like "[ [ 'a', 'b' ], [ 'c' ] ]"
        try {
          const fixed = s.replace(/'/g, '"')
          const parsed = JSON.parse(fixed)
          if (Array.isArray(parsed) || typeof parsed === 'object') return parsed
        } catch { /* fall through */ }
        // Try wrapping keys in quotes for JS objects like "{ min: null, max: null }"
        try {
          const quoted = s.replace(/(\w+):/g, '"$1":')
          const parsed = JSON.parse(quoted)
          if (Array.isArray(parsed) || typeof parsed === 'object') return parsed
        } catch { /* return as string below */ }
      }
    }
    return s
  }
  return String(raw)
}

/** Convert "fill-mask" → "fillMask", "type" → "type" */
function camelCase(s: string): string {
  return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

/** Strip quotes from values entries like "'button'" → "button" */
function cleanValue(v: string): string {
  let s = v.trim()
  if ((s.startsWith("'") && s.endsWith("'")) || (s.startsWith('"') && s.endsWith('"'))) {
    s = s.slice(1, -1)
  }
  return s
}

interface PropEntry {
  key: string
  type: PropType
  default: string | number | boolean
  options?: string[]
  description?: string
}

/** Maps our PropType → TypeScript primitive */
function tsType(t: PropType): string {
  if (t === 'boolean') return 'boolean'
  if (t === 'number') return 'number'
  return 'string'
}

function buildEntries(props: Record<string, QuasarProp>): PropEntry[] {
  const entries: PropEntry[] = []
  for (const [rawKey, prop] of Object.entries(props)) {
    if (prop.extends) continue
    const key = camelCase(rawKey)
    const type = mapType(prop)
    let def = cleanDefault(prop.default)
    // If no default, infer from type so the control panel can render it
    if (def === '' || def === undefined || def === null) {
      if (type === 'boolean') def = false
      else if (type === 'number') def = 0
      else def = ''
    }
    // Coerce Number-typed defaults to actual numbers — Quasar's docs
    // JSON quotes numeric defaults like `"default": "300"`, but the
    // runtime prop type is `Number`. Passing through the string
    // produces `Invalid prop: type check failed for prop "width"`
    // warnings.
    if (type === 'number' && typeof def === 'string' && def !== '') {
      const n = Number(def)
      if (Number.isFinite(n)) def = n
    }
    const entry: PropEntry = {
      key,
      type,
      default: def,
      description: prop.desc
    }
    if (type === 'select' && prop.values) {
      entry.options = prop.values.map(cleanValue)
    }
    entries.push(entry)
  }
  return entries
}

/** Serialize a default value to a TypeScript literal expression. */
function defaultToLiteral(def: unknown): string {
  if (typeof def === 'string') return `'${def.replace(/'/g, "\\'")}'`
  if (typeof def === 'boolean' || typeof def === 'number') return String(def)
  if (Array.isArray(def)) return JSON.stringify(def)
  if (typeof def === 'object' && def !== null) return JSON.stringify(def)
  return "''"
}

/** Generate the TypeScript source for one Q{Name}Props.ts */
function renderPropsFile(componentName: string, entries: PropEntry[]): string {
  const lines: string[] = []
  const varName = componentName[0].toLowerCase() + componentName.slice(1)
  lines.push(`// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.`)
  lines.push(`// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props`)
  lines.push('')
  lines.push(`import type { PropSchema } from '../../types/props'`)
  lines.push('')
  lines.push(`export const ${varName}Defaults = {`)
  for (const e of entries) {
    const lit = defaultToLiteral(e.default)
    lines.push(`  ${e.key}: ${lit},`)
  }
  lines.push(`} as const`)
  lines.push('')
  lines.push(`export const ${varName}Schema: PropSchema[] = [`)
  for (const e of entries) {
    const lit = defaultToLiteral(e.default)
    if (e.type === 'select' && e.options) {
      lines.push(`  { key: '${e.key}', type: 'select', default: ${lit}, options: [${e.options.map((o) => `'${o}'`).join(', ')}] },`)
    } else {
      lines.push(`  { key: '${e.key}', type: '${e.type}', default: ${lit} },`)
    }
  }
  lines.push(`]`)
  lines.push('')
  return lines.join('\n')
}

function readManifestSlugs(): Set<string> {
  if (!existsSync(MANIFEST_PATH)) return new Set()
  const src = readFileSync(MANIFEST_PATH, 'utf-8')
  const m = src.matchAll(/name:\s*'([^']+)'/g)
  return new Set(Array.from(m, (x) => x[1]))
}

function main() {
  const args = process.argv.slice(2)
  const onlyIdx = args.indexOf('--only')
  const only = onlyIdx >= 0 ? new Set(args[onlyIdx + 1].split(',')) : null

  if (!existsSync(QUASAR_API_DIR)) {
    console.error(`Quasar API JSON dir not found: ${QUASAR_API_DIR}`)
    console.error('Set QUASAR_API_DIR env var to the correct path.')
    process.exit(1)
  }

  mkdirSync(APP_PROPS_DIR, { recursive: true })

  const files = readdirSync(QUASAR_API_DIR).filter(
    (f) => f.startsWith('Q') && f.endsWith('.json')
  )
  const manifest = readManifestSlugs()

  let generated = 0
  let skipped = 0
  for (const file of files) {
    const name = file.replace(/\.json$/, '')
    if (only && !only.has(name)) {
      skipped++
      continue
    }
    if (manifest.size > 0 && !manifest.has(name)) {
      // not in the playground manifest — skip
      skipped++
      continue
    }
    const raw = readFileSync(join(QUASAR_API_DIR, file), 'utf-8')
    const data: QuasarApiJson = JSON.parse(raw)
    if (!data.props) {
      console.warn(`⚠ ${name}: no props in JSON, skipping`)
      continue
    }
    const entries = buildEntries(data.props)
    if (entries.length === 0) {
      console.warn(`⚠ ${name}: no entries after filtering, skipping`)
      continue
    }
    const out = renderPropsFile(name, entries)
    const outPath = join(APP_PROPS_DIR, `${name}Props.ts`)
    writeFileSync(outPath, out, 'utf-8')
    console.log(`✓ ${name} → ${outPath} (${entries.length} props)`)
    generated++
  }

  console.log(`\n${generated} generated, ${skipped} skipped`)
}

main()
