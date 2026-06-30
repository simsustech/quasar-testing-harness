// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qHeaderDefaults = {
  modelValue: true,
  reveal: false,
  revealOffset: 250,
  bordered: false,
  elevated: false,
  heightHint: '50',
} as const

export const qHeaderSchema: PropSchema[] = [
  { key: 'modelValue', type: 'boolean', default: true },
  { key: 'reveal', type: 'boolean', default: false },
  { key: 'revealOffset', type: 'number', default: 250 },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'elevated', type: 'boolean', default: false },
  { key: 'heightHint', type: 'string', default: '50' },
]
