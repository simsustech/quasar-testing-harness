// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qInfiniteScrollDefaults = {
  offset: 500,
  debounce: '100',
  initialIndex: 0,
  scrollTarget: '',
  disable: false,
  reverse: false
} as const

export const qInfiniteScrollSchema: PropSchema[] = [
  { key: 'offset', type: 'number', default: 500 },
  { key: 'debounce', type: 'string', default: '100' },
  { key: 'initialIndex', type: 'number', default: 0 },
  { key: 'scrollTarget', type: 'string', default: '' },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'reverse', type: 'boolean', default: false }
]
