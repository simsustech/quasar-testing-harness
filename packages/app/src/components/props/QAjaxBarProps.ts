// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qAjaxBarDefaults = {
  position: 'top',
  size: '2px',
  color: '',
  reverse: false,
  skipHijack: false,
  hijackFilter: '',
} as const

export const qAjaxBarSchema: PropSchema[] = [
  { key: 'position', type: 'select', default: 'top', options: ['top', 'right', 'bottom', 'left'] },
  { key: 'size', type: 'string', default: '2px' },
  { key: 'color', type: 'string', default: '' },
  { key: 'reverse', type: 'boolean', default: false },
  { key: 'skipHijack', type: 'boolean', default: false },
  { key: 'hijackFilter', type: 'string', default: '' },
]
