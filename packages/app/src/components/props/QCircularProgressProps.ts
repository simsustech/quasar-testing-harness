// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qCircularProgressDefaults = {
  size: '',
  value: 0,
  min: 0,
  max: 100,
  color: '',
  centerColor: '',
  trackColor: '',
  fontSize: '',
  rounded: false,
  thickness: 0.2,
  angle: 0,
  indeterminate: false,
  showValue: false,
  reverse: false,
  instantFeedback: false,
  animationSpeed: '600',
} as const

export const qCircularProgressSchema: PropSchema[] = [
  { key: 'size', type: 'string', default: '' },
  { key: 'value', type: 'number', default: 0 },
  { key: 'min', type: 'number', default: 0 },
  { key: 'max', type: 'number', default: 100 },
  { key: 'color', type: 'string', default: '' },
  { key: 'centerColor', type: 'string', default: '' },
  { key: 'trackColor', type: 'string', default: '' },
  { key: 'fontSize', type: 'string', default: '' },
  { key: 'rounded', type: 'boolean', default: false },
  { key: 'thickness', type: 'number', default: 0.2 },
  { key: 'angle', type: 'number', default: 0 },
  { key: 'indeterminate', type: 'boolean', default: false },
  { key: 'showValue', type: 'boolean', default: false },
  { key: 'reverse', type: 'boolean', default: false },
  { key: 'instantFeedback', type: 'boolean', default: false },
  { key: 'animationSpeed', type: 'string', default: '600' },
]
