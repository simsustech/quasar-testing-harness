// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qCheckboxDefaults = {
  name: '',
  size: '',
  modelValue: '',
  val: '',
  trueValue: true,
  falseValue: false,
  indeterminateValue: '',
  toggleOrder: '',
  toggleIndeterminate: false,
  label: '',
  leftLabel: false,
  checkedIcon: '',
  uncheckedIcon: '',
  indeterminateIcon: '',
  color: '',
  keepColor: false,
  dark: '',
  dense: false,
  disable: false,
  tabindex: '',
} as const

export const qCheckboxSchema: PropSchema[] = [
  { key: 'name', type: 'string', default: '' },
  { key: 'size', type: 'string', default: '' },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'val', type: 'string', default: '' },
  { key: 'trueValue', type: 'string', default: true },
  { key: 'falseValue', type: 'string', default: false },
  { key: 'indeterminateValue', type: 'string', default: '' },
  { key: 'toggleOrder', type: 'select', default: '', options: ['tf', 'ft'] },
  { key: 'toggleIndeterminate', type: 'boolean', default: false },
  { key: 'label', type: 'string', default: '' },
  { key: 'leftLabel', type: 'boolean', default: false },
  { key: 'checkedIcon', type: 'string', default: '' },
  { key: 'uncheckedIcon', type: 'string', default: '' },
  { key: 'indeterminateIcon', type: 'string', default: '' },
  { key: 'color', type: 'string', default: '' },
  { key: 'keepColor', type: 'boolean', default: false },
  { key: 'dark', type: 'string', default: '' },
  { key: 'dense', type: 'boolean', default: false },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'tabindex', type: 'string', default: '' },
]
