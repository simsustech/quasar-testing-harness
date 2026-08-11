// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qColorDefaults = {
  name: '',
  modelValue: '',
  defaultValue: '',
  defaultView: 'spectrum',
  formatModel: 'auto',
  palette: '',
  square: false,
  flat: false,
  bordered: false,
  noHeader: false,
  noHeaderTabs: false,
  noFooter: false,
  disable: false,
  readonly: false,
  dark: ''
} as const

export const qColorSchema: PropSchema[] = [
  { key: 'name', type: 'string', default: '' },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'defaultValue', type: 'string', default: '' },
  {
    key: 'defaultView',
    type: 'select',
    default: 'spectrum',
    options: ['spectrum', 'tune', 'palette']
  },
  {
    key: 'formatModel',
    type: 'select',
    default: 'auto',
    options: ['auto', 'hex', 'rgb', 'hexa', 'rgba']
  },
  { key: 'palette', type: 'string', default: '' },
  { key: 'square', type: 'boolean', default: false },
  { key: 'flat', type: 'boolean', default: false },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'noHeader', type: 'boolean', default: false },
  { key: 'noHeaderTabs', type: 'boolean', default: false },
  { key: 'noFooter', type: 'boolean', default: false },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'readonly', type: 'boolean', default: false },
  { key: 'dark', type: 'string', default: '' }
]
