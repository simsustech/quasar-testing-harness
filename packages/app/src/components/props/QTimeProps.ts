// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qTimeDefaults = {
  name: '',
  landscape: false,
  mask: 'HH:mm',
  locale: '',
  calendar: 'gregorian',
  color: '',
  textColor: '',
  dark: '',
  square: false,
  flat: false,
  bordered: false,
  readonly: false,
  disable: false,
  modelValue: '',
  format24h: '',
  defaultDate: '',
  options: '',
  hourOptions: '',
  minuteOptions: '',
  secondOptions: '',
  withSeconds: false,
  nowBtn: false
} as const

export const qTimeSchema: PropSchema[] = [
  { key: 'name', type: 'string', default: '' },
  { key: 'landscape', type: 'boolean', default: false },
  { key: 'mask', type: 'string', default: 'HH:mm' },
  { key: 'locale', type: 'string', default: '' },
  {
    key: 'calendar',
    type: 'select',
    default: 'gregorian',
    options: ['gregorian', 'persian']
  },
  { key: 'color', type: 'string', default: '' },
  { key: 'textColor', type: 'string', default: '' },
  { key: 'dark', type: 'string', default: '' },
  { key: 'square', type: 'boolean', default: false },
  { key: 'flat', type: 'boolean', default: false },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'readonly', type: 'boolean', default: false },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'format24h', type: 'string', default: '' },
  { key: 'defaultDate', type: 'string', default: '' },
  { key: 'options', type: 'string', default: '' },
  { key: 'hourOptions', type: 'string', default: '' },
  { key: 'minuteOptions', type: 'string', default: '' },
  { key: 'secondOptions', type: 'string', default: '' },
  { key: 'withSeconds', type: 'boolean', default: false },
  { key: 'nowBtn', type: 'boolean', default: false }
]
