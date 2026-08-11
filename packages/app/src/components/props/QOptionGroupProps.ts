// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qOptionGroupDefaults = {
  size: '',
  modelValue: '',
  options: [],
  optionValue: 'value',
  optionLabel: 'label',
  optionDisable: 'disable',
  name: '',
  type: 'radio',
  color: '',
  keepColor: false,
  dark: '',
  dense: false,
  leftLabel: false,
  inline: false,
  disable: false
} as const

export const qOptionGroupSchema: PropSchema[] = [
  { key: 'size', type: 'string', default: '' },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'options', type: 'string', default: [] },
  { key: 'optionValue', type: 'string', default: 'value' },
  { key: 'optionLabel', type: 'string', default: 'label' },
  { key: 'optionDisable', type: 'string', default: 'disable' },
  { key: 'name', type: 'string', default: '' },
  {
    key: 'type',
    type: 'select',
    default: 'radio',
    options: ['radio', 'checkbox', 'toggle']
  },
  { key: 'color', type: 'string', default: '' },
  { key: 'keepColor', type: 'boolean', default: false },
  { key: 'dark', type: 'string', default: '' },
  { key: 'dense', type: 'boolean', default: false },
  { key: 'leftLabel', type: 'boolean', default: false },
  { key: 'inline', type: 'boolean', default: false },
  { key: 'disable', type: 'boolean', default: false }
]
