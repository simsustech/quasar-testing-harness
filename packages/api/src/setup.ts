import type { FastifyInstance } from 'fastify'
import { fileURLToPath } from 'node:url'

// Import the SSR plugin from the built app package.
// The app must be built first with: vitrify build -m ssr
const { fastifySsrPlugin } = await import(
  '@quasar-testing-harness/app/fastify-ssr-plugin'
)

const { hooks } = await import('@quasar-testing-harness/app/hooks')

export default async function (fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => ({
    status: 'ok',
    package: '@quasar-testing-harness/api'
  }))

  // Register the SSR plugin — serves the Quasar playground app.
  // In dev mode (vitrify dev -m fastify) this runs the SSR plugin in
  // development mode (creates its own Vite dev server for hot-reloadable
  // rendering). In production it serves the pre-built SSR bundle.
  await fastify.register(fastifySsrPlugin, {
    onAppRendered: hooks.onAppRendered,
    onTemplateRendered: hooks.onTemplateRendered
  })
}
