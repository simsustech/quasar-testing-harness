// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qSkeletonDefaults = {
  dark: '',
  type: 'rect',
  animation: 'wave',
  animationSpeed: '1500',
  square: false,
  bordered: false,
  size: '',
  width: '',
  height: '',
  tag: 'div'
} as const

export const qSkeletonSchema: PropSchema[] = [
  { key: 'dark', type: 'string', default: '' },
  {
    key: 'type',
    type: 'select',
    default: 'rect',
    options: [
      'text',
      'rect',
      'circle',
      'QBtn',
      'QBadge',
      'QChip',
      'QToolbar',
      'QCheckbox',
      'QRadio',
      'QToggle',
      'QSlider',
      'QRange',
      'QInput',
      'QAvatar'
    ]
  },
  {
    key: 'animation',
    type: 'select',
    default: 'wave',
    options: ['wave', 'pulse', 'pulse-x', 'pulse-y', 'fade', 'blink', 'none']
  },
  { key: 'animationSpeed', type: 'string', default: '1500' },
  { key: 'square', type: 'boolean', default: false },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'size', type: 'string', default: '' },
  { key: 'width', type: 'string', default: '' },
  { key: 'height', type: 'string', default: '' },
  { key: 'tag', type: 'string', default: 'div' }
]
