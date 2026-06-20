// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qPageScrollerDefaults = {
  position: 'bottom-right',
  offset: '[ 18, 18 ]',
  expand: false,
  scrollOffset: 1000,
  reverse: false,
  duration: 300,
} as const

export const qPageScrollerSchema: PropSchema[] = [
  { key: 'position', type: 'select', default: 'bottom-right', options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top', 'right', 'bottom', 'left'] },
  { key: 'offset', type: 'string', default: '[ 18, 18 ]' },
  { key: 'expand', type: 'boolean', default: false },
  { key: 'scrollOffset', type: 'number', default: 1000 },
  { key: 'reverse', type: 'boolean', default: false },
  { key: 'duration', type: 'number', default: 300 },
]
