// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qBadgeDefaults = {
  color: '',
  textColor: '',
  floating: false,
  transparent: false,
  multiLine: false,
  label: '',
  align: '',
  outline: false,
  rounded: false,
} as const

export const qBadgeSchema: PropSchema[] = [
  { key: 'color', type: 'string', default: '' },
  { key: 'textColor', type: 'string', default: '' },
  { key: 'floating', type: 'boolean', default: false },
  { key: 'transparent', type: 'boolean', default: false },
  { key: 'multiLine', type: 'boolean', default: false },
  { key: 'label', type: 'string', default: '' },
  { key: 'align', type: 'select', default: '', options: ['top', 'middle', 'bottom'] },
  { key: 'outline', type: 'boolean', default: false },
  { key: 'rounded', type: 'boolean', default: false },
]
