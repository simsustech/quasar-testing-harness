// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qTabsDefaults = {
  modelValue: '',
  vertical: false,
  outsideArrows: false,
  mobileArrows: false,
  align: 'center',
  breakpoint: '600',
  activeColor: '',
  activeBgColor: '',
  indicatorColor: '',
  indicatorShape: 'line',
  contentClass: '',
  activeClass: '',
  leftIcon: '',
  rightIcon: '',
  stretch: false,
  shrink: false,
  switchIndicator: false,
  narrowIndicator: false,
  inlineLabel: false,
  noCaps: false,
  dense: false,
} as const

export const qTabsSchema: PropSchema[] = [
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'vertical', type: 'boolean', default: false },
  { key: 'outsideArrows', type: 'boolean', default: false },
  { key: 'mobileArrows', type: 'boolean', default: false },
  { key: 'align', type: 'select', default: 'center', options: ['left', 'center', 'right', 'justify'] },
  { key: 'breakpoint', type: 'string', default: '600' },
  { key: 'activeColor', type: 'string', default: '' },
  { key: 'activeBgColor', type: 'string', default: '' },
  { key: 'indicatorColor', type: 'string', default: '' },
  { key: 'indicatorShape', type: 'string', default: 'line' },
  { key: 'contentClass', type: 'string', default: '' },
  { key: 'activeClass', type: 'string', default: '' },
  { key: 'leftIcon', type: 'string', default: '' },
  { key: 'rightIcon', type: 'string', default: '' },
  { key: 'stretch', type: 'boolean', default: false },
  { key: 'shrink', type: 'boolean', default: false },
  { key: 'switchIndicator', type: 'boolean', default: false },
  { key: 'narrowIndicator', type: 'boolean', default: false },
  { key: 'inlineLabel', type: 'boolean', default: false },
  { key: 'noCaps', type: 'boolean', default: false },
  { key: 'dense', type: 'boolean', default: false },
]
