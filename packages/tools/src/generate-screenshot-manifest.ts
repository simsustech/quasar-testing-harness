#!/usr/bin/env node
/**
 * Generate a manifest.json of all screenshots in the review directory.
 *
 * Scans packages/app/public/screenshots/{style}/{device}/{component}/*.png
 * and reads companion .json sidecars for the page URL. Outputs a grouped
 * list that the ReviewPage consumes to render the carousel.
 *
 * Usage:
 *   pnpm --filter @quasar-testing-harness/tools generate:screenshots
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SCREENSHOTS_DIR =
  process.env.SCREENSHOTS_DIR ||
  join(__dirname, '..', '..', 'app', 'public', 'screenshots')

const STYLES = ['md3', 'md2', 'unstyled']
const DEVICES = ['desktop', 'sm', 'md', 'lg']

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

function generateManifest(): void {
  if (!existsSync(SCREENSHOTS_DIR)) {
    mkdirSync(SCREENSHOTS_DIR, { recursive: true })
    console.log(`Created empty screenshots directory: ${SCREENSHOTS_DIR}`)
    writeManifest([])
    return
  }

  const groups: ScreenshotGroup[] = []

  for (const style of STYLES) {
    const styleDir = join(SCREENSHOTS_DIR, style)
    if (!existsSync(styleDir)) continue

    const deviceDirs = readdirSync(styleDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())

    for (const deviceDir of deviceDirs) {
      const device = deviceDir.name
      const devicePath = join(styleDir, device)
      const componentDirs = readdirSync(devicePath, { withFileTypes: true })
        .filter((d) => d.isDirectory())

      for (const comp of componentDirs) {
        const componentDir = join(devicePath, comp.name)
        const files = readdirSync(componentDir).filter((f) => f.endsWith('.png'))

        let group = groups.find((g) => g.component === comp.name)
        if (!group) {
          group = { component: comp.name, screenshots: [] }
          groups.push(group)
        }

        for (const file of files) {
          const label = file.slice(file.indexOf('__') + 2).replace(/\.png$/, '')
          const jsonPath = join(componentDir, file.replace(/\.png$/, '.json'))
          let url: string | null = null

          if (existsSync(jsonPath)) {
            try {
              const data = JSON.parse(readFileSync(jsonPath, 'utf-8'))
              if (data && typeof data.url === 'string') {
                try {
                  const parsed = new URL(data.url)
                  url = parsed.pathname + parsed.search
                } catch {
                  url = data.url
                }
              }
            } catch { /* skip invalid JSON */ }
          }

          group.screenshots.push({
            image: `/screenshots/${style}/${device}/${comp.name}/${file}`,
            label,
            style,
            device,
            url,
          })
        }
      }
    }
  }

  writeManifest(groups, groups.length)
}

function writeManifest(groups: ScreenshotGroup[], componentCount?: number): void {
  const manifest = {
    generatedAt: new Date().toISOString(),
    groups,
  }

  const outPath = join(SCREENSHOTS_DIR, 'manifest.json')
  writeFileSync(outPath, JSON.stringify(manifest, null, 2))
  const total = groups.reduce((s, g) => s + g.screenshots.length, 0)
  console.log(
    `Wrote ${outPath} — ${componentCount ?? groups.length} components, ${total} screenshots`
  )
}

generateManifest()
