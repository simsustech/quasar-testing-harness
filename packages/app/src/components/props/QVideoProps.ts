// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qVideoDefaults = {
  ratio: '',
  src: '',
  title: '',
  fetchpriority: 'auto',
  loading: 'eager',
  referrerpolicy: 'strict-origin-when-cross-origin'
} as const

export const qVideoSchema: PropSchema[] = [
  { key: 'ratio', type: 'string', default: '' },
  { key: 'src', type: 'string', default: '' },
  { key: 'title', type: 'string', default: '' },
  {
    key: 'fetchpriority',
    type: 'select',
    default: 'auto',
    options: ['high', 'low', 'auto']
  },
  {
    key: 'loading',
    type: 'select',
    default: 'eager',
    options: ['eager', 'lazy']
  },
  {
    key: 'referrerpolicy',
    type: 'select',
    default: 'strict-origin-when-cross-origin',
    options: [
      'no-referrer',
      'no-referrer-when-downgrade',
      'origin',
      'origin-when-cross-origin',
      'same-origin',
      'strict-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url'
    ]
  }
]
