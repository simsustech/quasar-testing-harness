// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qTimelineDefaults = {
  color: 'primary',
  side: 'right',
  layout: 'dense',
  dark: ''
} as const

export const qTimelineSchema: PropSchema[] = [
  { key: 'color', type: 'string', default: 'primary' },
  { key: 'side', type: 'select', default: 'right', options: ['left', 'right'] },
  {
    key: 'layout',
    type: 'select',
    default: 'dense',
    options: ['dense', 'comfortable', 'loose']
  },
  { key: 'dark', type: 'string', default: '' }
]
