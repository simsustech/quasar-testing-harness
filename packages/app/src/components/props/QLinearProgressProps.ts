// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qLinearProgressDefaults = {
  size: '',
  value: 0,
  buffer: 0,
  color: '',
  trackColor: '',
  dark: '',
  reverse: false,
  stripe: false,
  indeterminate: false,
  query: false,
  rounded: false,
  instantFeedback: false,
  animationSpeed: '2100',
} as const

export const qLinearProgressSchema: PropSchema[] = [
  { key: 'size', type: 'string', default: '' },
  { key: 'value', type: 'number', default: 0 },
  { key: 'buffer', type: 'number', default: 0 },
  { key: 'color', type: 'string', default: '' },
  { key: 'trackColor', type: 'string', default: '' },
  { key: 'dark', type: 'string', default: '' },
  { key: 'reverse', type: 'boolean', default: false },
  { key: 'stripe', type: 'boolean', default: false },
  { key: 'indeterminate', type: 'boolean', default: false },
  { key: 'query', type: 'boolean', default: false },
  { key: 'rounded', type: 'boolean', default: false },
  { key: 'instantFeedback', type: 'boolean', default: false },
  { key: 'animationSpeed', type: 'string', default: '2100' },
]
