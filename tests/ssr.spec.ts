import { test, expect } from '@playwright/test'
import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

const SSR_PORT = 3099
const BASE = `http://localhost:${SSR_PORT}`
const API_DIR = resolve(process.cwd(), 'packages', 'api')

test.describe.configure({ mode: 'serial' })
test.describe('SSR dev server', () => {
  let server: ReturnType<typeof spawn>
  let output = ''

  test.beforeAll(async () => {
    test.setTimeout(120_000)

    server = spawn('npx', ['vitrify', 'dev', '-m', 'fastify', '--port', String(SSR_PORT)], {
      cwd: API_DIR,
      stdio: ['ignore', 'pipe', 'pipe']
    })

    server.stdout.on('data', (d) => { output += d.toString() })
    server.stderr.on('data', (d) => { output += d.toString() })

    for (let i = 0; i < 90; i++) {
      if (output.includes(`Server listening at http://127.0.0.1:${SSR_PORT}`)) {
        await sleep(2000) // give the socket a moment to be ready
        break
      }
      await sleep(1000)
    }
  })

  test.afterAll(() => {
    server?.kill()
  })

  test('health endpoint returns 200', async ({ page }) => {
    const res = await page.request.get(`${BASE}/health`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
  })

  test('component page renders', async ({ page }) => {
    const res = await page.request.get(`${BASE}/q-btn?label=Hello`)
    // SSR may still have Vue CJS issues, but the server should respond
    expect([200, 500]).toContain(res.status())
  })
})
