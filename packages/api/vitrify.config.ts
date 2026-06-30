import type { VitrifyConfig } from 'vitrify'

export default async function (): Promise<VitrifyConfig> {
  const config: VitrifyConfig = {
    vitrify: {
      hooks: {
        onSetup: [new URL('src/setup.ts', import.meta.url)]
      },
      ssr: {
        fastify: {
          bodyLimit: 10e6
        },
        serverModules: ['@quasar-testing-harness/app']
      }
    }
  }
  return config
}
