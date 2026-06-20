// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qSplitterDefaults = {
  modelValue: 0,
  reverse: false,
  unit: '%',
  emitImmediately: false,
  horizontal: false,
  limits: '# [10, 90]/[50, Infinity]',
  disable: false,
  beforeClass: '',
  afterClass: '',
  separatorClass: '',
  separatorStyle: '',
  dark: '',
} as const

export const qSplitterSchema: PropSchema[] = [
  { key: 'modelValue', type: 'number', default: 0 },
  { key: 'reverse', type: 'boolean', default: false },
  { key: 'unit', type: 'select', default: '%', options: ['%', 'px'] },
  { key: 'emitImmediately', type: 'boolean', default: false },
  { key: 'horizontal', type: 'boolean', default: false },
  { key: 'limits', type: 'string', default: '# [10, 90]/[50, Infinity]' },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'beforeClass', type: 'string', default: '' },
  { key: 'afterClass', type: 'string', default: '' },
  { key: 'separatorClass', type: 'string', default: '' },
  { key: 'separatorStyle', type: 'string', default: '' },
  { key: 'dark', type: 'string', default: '' },
]
