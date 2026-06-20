// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qMarkupTableDefaults = {
  dense: false,
  dark: '',
  flat: false,
  bordered: false,
  square: false,
  separator: 'horizontal',
  wrapCells: false,
} as const

export const qMarkupTableSchema: PropSchema[] = [
  { key: 'dense', type: 'boolean', default: false },
  { key: 'dark', type: 'string', default: '' },
  { key: 'flat', type: 'boolean', default: false },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'square', type: 'boolean', default: false },
  { key: 'separator', type: 'select', default: 'horizontal', options: ['horizontal', 'vertical', 'cell', 'none'] },
  { key: 'wrapCells', type: 'boolean', default: false },
]
