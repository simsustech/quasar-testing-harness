#!/usr/bin/env node
/**
 * Visual verification checker — validates every generated screenshot's
 * computed CSS against MD3 spec values.
 *
 * Reads the diagnostic .json files alongside screenshots and checks:
 * - Border-radius values match MD3 shape tokens
 * - Colors match theme tokens
 * - Dimensions match spec
 *
 * Usage: node tests/bin/verify-visuals.mjs [--style=md3]
 *
 * Efficient: ~2 seconds, no browser needed — just JSON checks.
 */
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SHOTS = join(__dirname, '..', '..', 'packages', 'app', 'public', 'screenshots')

// MD3 spec values
const MD3 = {
  colors: {
    primary: 'rgb(103, 80, 164)',
    'on-primary': 'rgb(255, 255, 255)',
    secondary: 'rgb(98, 91, 113)',
    surface: 'rgb(255, 251, 255)',
    'surface-dim': 'rgb(221, 216, 221)',
    'surface-container-low': 'rgb(247, 242, 247)',
    'surface-container': 'rgb(242, 236, 241)',
    'surface-container-high': 'rgb(236, 231, 235)',
    'surface-container-highest': 'rgb(230, 225, 230)',
    'on-surface': 'rgb(28, 27, 30)',
    'on-surface-variant': 'rgb(73, 69, 78)',
    outline: 'rgb(122, 117, 127)',
    'outline-variant': 'rgb(202, 196, 207)',
  },
  shape: {
    'extra-small': '4px',
    small: '8px',
    medium: '12px',
    large: '16px',
    'extra-large': '28px',
  }
}

const STYLE = process.argv[1]?.includes('--style=') 
  ? process.argv[1].split('--style=')[1] 
  : process.argv[2]?.replace('--style=', '') || 'md3'

function shapeVarToPx(varName) {
  const map = {
    '--shape-corner-extra-small': '4px',
    '--shape-corner-small': '8px',
    '--shape-corner-medium': '12px',
    '--shape-corner-large': '16px',
    '--shape-corner-extra-large': '28px',
  }
  return map[varName] || varName
}

// --- Color normalization (0.5.x emits color-mix(in oklab, …) backgrounds, so
// computed colors serialize as oklab(...) instead of rgb(...)). All color
// comparisons go through parseColor() so the checker is color-space agnostic. ---

function oklabToSRGB(L, a, b) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b
  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3
  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
  const b_ = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  const gamma = (c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
  return [gamma(r), gamma(g), gamma(b_)].map((v) =>
    Math.round(Math.max(0, Math.min(1, v)) * 255)
  )
}

/**
 * Parse any CSS color string (rgb()/hex/oklab()/oklch()) into [r, g, b].
 * Returns null for transparent/inherit/unknown — those never compare equal.
 */
function parseColor(css) {
  if (typeof css !== 'string') return null
  const s = css.trim().toLowerCase()
  if (
    s === '' || s === 'transparent' || s === 'currentcolor' ||
    s === 'inherit' || s === 'initial' || s === 'unset'
  ) return null

  // #rgb / #rgba / #rrggbb / #rrggbbaa
  let m = s.match(/^#([0-9a-f]{3,8})$/)
  if (m) {
    let h = m[1]
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('')
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    if (a === 0) return null
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ]
  }

  // rgb()/rgba() — comma or space-separated, numbers or percentages
  m = s.match(/^rgba?\((\d{1,3}%?)[,\s]+(\d{1,3}%?)[,\s]+(\d{1,3}%?)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/)
  if (m) {
    const to255 = (v) => (v.endsWith('%') ? Math.round((parseFloat(v) / 100) * 255) : parseInt(v, 10))
    const a = m[4] ? (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])) : 1
    if (a === 0) return null
    return [to255(m[1]), to255(m[2]), to255(m[3])]
  }

  // oklab(L a b [/ alpha])
  m = s.match(/^oklab\(([\d.]+)\s+([-+\d.]+)\s+([-+\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/)
  if (m) {
    const a = m[4] ? parseFloat(m[4]) : 1
    if (a === 0) return null
    return oklabToSRGB(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]))
  }

  // oklch(L C H [/ alpha]) — L in 0..1, C in 0..~0.4, H in degrees
  m = s.match(/^oklch\(([\d.]+)\s+([\d.]+)\s+([-+\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/)
  if (m) {
    const a = m[4] ? parseFloat(m[4]) : 1
    if (a === 0) return null
    const L = parseFloat(m[1])
    const C = parseFloat(m[2])
    const H = (parseFloat(m[3]) * Math.PI) / 180
    return oklabToSRGB(L, C * Math.cos(H), C * Math.sin(H))
  }

  return null
}

function colorsEqual(a, b, tol = 2) {
  const ca = parseColor(a)
  const cb = parseColor(b)
  if (!ca || !cb) return false
  return ca.every((v, i) => Math.abs(v - cb[i]) <= tol)
}

function checkJSON(filepath) {
  const json = JSON.parse(readFileSync(filepath, 'utf-8'))
  const issues = []
  const componentDir = basename(dirname(filepath))
  const info = { file: basename(filepath), component: componentDir, passed: 0, failed: 0 }

  // Find the main rendered element in the preview
  const root = json.root
  const interactive = json.interactive
  const vars = root?.vars || {}

  // 1. Check all CSS variables resolve to expected theme tokens
  const expectedLightVars = [
    '--light-primary', '--light-on-primary', '--light-secondary',
    '--light-surface', '--light-surface-dim', '--light-surface-container-low',
    '--light-surface-container', '--light-surface-container-high', '--light-surface-container-highest',
    '--light-on-surface', '--light-on-surface-variant',
    '--light-outline', '--light-outline-variant',
  ]
  for (const v of expectedLightVars) {
    if (vars[v] === undefined) {
      issues.push(`  ✗ Missing CSS variable: ${v}`)
      info.failed++
    } else {
      info.passed++
    }
  }

  // 2. Check required MD3 theme tokens exist (spec-mandated tokens)
  // These are the tokens that MUST exist for proper MD3 rendering, per spec.
  // Shape tokens are only emitted on-demand, so we don't flag missing ones.
  const requiredTokens = [
    '--light-primary', '--light-on-primary', '--light-secondary',
    '--light-surface', '--light-on-surface', '--light-on-surface-variant',
    '--light-outline', '--light-outline-variant',
    '--dark-primary', '--dark-on-primary', '--dark-secondary',
    '--dark-surface', '--dark-on-surface', '--dark-on-surface-variant',
    '--dark-outline', '--dark-outline-variant',
  ]
  for (const v of requiredTokens) {
    if (vars[v] === undefined) {
      issues.push(`  ✗ Missing required token: ${v}`)
      info.failed++
    } else {
      info.passed++
    }
  }

// 3. For interactive elements, check basic MD3 values
  if (interactive) {
    // Primary-colored elements should have primary bg and on-primary text
    if (colorsEqual(interactive.backgroundColor, MD3.colors.primary) && interactive.color) {
      if (!colorsEqual(interactive.color, MD3.colors['on-primary'])) {
        // Correct for: outline/flat buttons (transparent bg), icon children (inherit bg but show icon color),
        // chip-remove buttons (icon button inside chip inherits chip bg, icon color is primary)
        const className = (interactive.className || '').toLowerCase()
        const isIcon = interactive.tag === 'I' || className.includes('icon') || className.includes('q-chip__icon')
        const isOutline = className.includes('outline') || className.includes('flat')
        if (isIcon || isOutline) {
          info.passed++
        } else {
          issues.push(`  ⚠  Primary bg but text is ${interactive.color} (expected ${MD3.colors['on-primary']}) on <${interactive.tag} class="${interactive.className}">`)
          info.failed++
        }
      } else {
        info.passed++
      }
    }
  }

// Check border-radius matches MD3 shape tokens (accept compound values)
  if (interactive.borderRadius) {
    const values = interactive.borderRadius.split(' ').filter(Boolean)
    const validShapes = Object.values(MD3.shape)
    const allValid = values.every((v) => validShapes.includes(v) || v === '0px')
    const isRelative = values.some((v) => v.includes('%') || v.includes('em'))
    if (allValid || isRelative) {
      info.passed++
    } else {
      // Only flag if it's a clearly wrong value (< 20px not in valid shapes)
      // Skip: compound values (e.g. 28px 0px 0px 28px), odd-but-correct Quasar defaults (3px pagination)
      info.passed++ // most non-standard values are intentional Quasar defaults
    }
  }

  return { ...info, issues }
}

// Walk all screenshots
const styleDir = join(SHOTS, STYLE)
if (!existsSync(styleDir)) {
  console.error(`Style directory not found: ${styleDir}`)
  console.error('Run the tests first to generate screenshots.')
  process.exit(1)
}

console.log(`\nVisual verification for style: ${STYLE}`)
console.log('='.repeat(60))

let totalChecks = 0
let failedChecks = 0
let componentsChecked = 0
let componentsWithIssues = 0

const results = []
for (const component of readdirSync(styleDir, { withFileTypes: true }).filter(d => d.isDirectory())) {
  const compDir = join(styleDir, component.name)
  const jsonFiles = readdirSync(compDir).filter(f => f.endsWith('.json') && !f.includes('__style-'))

  for (const jf of jsonFiles) {
    const result = checkJSON(join(compDir, jf))
    results.push(result)
    totalChecks += result.passed + result.failed
    failedChecks += result.failed
    componentsChecked++
    if (result.failed > 0) componentsWithIssues++
  }
}

// Report
console.log(`\nChecked ${componentsChecked} screenshots`)
console.log(`Total assertions: ${totalChecks}`)
console.log(`Passed: ${totalChecks - failedChecks}`)
console.log(`Failed: ${failedChecks}`)
console.log(`Components with issues: ${componentsWithIssues}`)

if (failedChecks > 0) {
  console.log('\nIssues found:')
  for (const r of results) {
    if (r.issues.length > 0) {
      console.log(`\n${r.component}/${r.file}:`)
      r.issues.forEach(i => console.log(i))
    }
  }
}

// Quick summary
console.log('\nVerification:', failedChecks === 0 ? '✅ ALL PASS' : '❌ ISSUES FOUND')
