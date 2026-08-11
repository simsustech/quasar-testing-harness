// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qDrawerDefaults = {
  modelValue: '',
  side: 'left',
  overlay: false,
  width: 300,
  mini: false,
  miniWidth: 57,
  miniToOverlay: false,
  noMiniAnimation: false,
  dark: '',
  breakpoint: 1023,
  behavior: 'default',
  bordered: false,
  elevated: false,
  persistent: false,
  showIfAbove: false,
  noSwipeOpen: false,
  noSwipeClose: false,
  noSwipeBackdrop: false
} as const

export const qDrawerSchema: PropSchema[] = [
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'side', type: 'select', default: 'left', options: ['left', 'right'] },
  { key: 'overlay', type: 'boolean', default: false },
  { key: 'width', type: 'number', default: 300 },
  { key: 'mini', type: 'boolean', default: false },
  { key: 'miniWidth', type: 'number', default: 57 },
  { key: 'miniToOverlay', type: 'boolean', default: false },
  { key: 'noMiniAnimation', type: 'boolean', default: false },
  { key: 'dark', type: 'string', default: '' },
  { key: 'breakpoint', type: 'number', default: 1023 },
  {
    key: 'behavior',
    type: 'select',
    default: 'default',
    options: ['default', 'desktop', 'mobile']
  },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'elevated', type: 'boolean', default: false },
  { key: 'persistent', type: 'boolean', default: false },
  { key: 'showIfAbove', type: 'boolean', default: false },
  { key: 'noSwipeOpen', type: 'boolean', default: false },
  { key: 'noSwipeClose', type: 'boolean', default: false },
  { key: 'noSwipeBackdrop', type: 'boolean', default: false }
]
