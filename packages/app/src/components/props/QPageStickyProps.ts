// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qPageStickyDefaults = {
  position: 'bottom-right',
  offset: '',
  expand: false,
} as const

export const qPageStickySchema: PropSchema[] = [
  { key: 'position', type: 'select', default: 'bottom-right', options: ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top', 'right', 'bottom', 'left'] },
  { key: 'offset', type: 'string', default: '' },
  { key: 'expand', type: 'boolean', default: false },
]
