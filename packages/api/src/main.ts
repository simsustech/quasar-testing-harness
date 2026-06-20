// Placeholder for the SSR host. The Fastify SSR integration will mount the
// Vitrify-built app from @quasar-testing-harness/app and serve it. Not yet implemented.

import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok', package: '@quasar-testing-harness/api' }
})

const start = async () => {
  try {
    await app.listen({ port: 3001, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
