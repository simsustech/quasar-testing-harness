// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qSeparatorDefaults = {
  dark: '',
  spaced: '',
  inset: '',
  vertical: false,
  size: '',
  color: ''
} as const

export const qSeparatorSchema: PropSchema[] = [
  { key: 'dark', type: 'string', default: '' },
  { key: 'spaced', type: 'string', default: '' },
  {
    key: 'inset',
    type: 'select',
    default: '',
    options: ['true', 'false', 'item', 'item-thumbnail']
  },
  { key: 'vertical', type: 'boolean', default: false },
  { key: 'size', type: 'string', default: '' },
  { key: 'color', type: 'string', default: '' }
]
