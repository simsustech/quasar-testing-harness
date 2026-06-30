// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qPopupEditDefaults = {
  modelValue: '',
  title: '',
  buttons: false,
  labelSet: '',
  labelCancel: '',
  autoSave: false,
  color: 'primary',
  validate: '() => true',
  disable: false,
  fit: false,
  cover: true,
  anchor: '',
  self: '',
  offset: '',
  touchPosition: false,
  persistent: false,
  separateClosePopup: false,
  square: false,
  maxHeight: '',
  maxWidth: '',
} as const

export const qPopupEditSchema: PropSchema[] = [
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'title', type: 'string', default: '' },
  { key: 'buttons', type: 'boolean', default: false },
  { key: 'labelSet', type: 'string', default: '' },
  { key: 'labelCancel', type: 'string', default: '' },
  { key: 'autoSave', type: 'boolean', default: false },
  { key: 'color', type: 'string', default: 'primary' },
  { key: 'validate', type: 'string', default: '() => true' },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'fit', type: 'boolean', default: false },
  { key: 'cover', type: 'boolean', default: true },
  { key: 'anchor', type: 'select', default: '', options: ['top left', 'top middle', 'top right', 'top start', 'top end', 'center left', 'center middle', 'center right', 'center start', 'center end', 'bottom left', 'bottom middle', 'bottom right', 'bottom start', 'bottom end'] },
  { key: 'self', type: 'select', default: '', options: ['top left', 'top middle', 'top right', 'top start', 'top end', 'center left', 'center middle', 'center right', 'center start', 'center end', 'bottom left', 'bottom middle', 'bottom right', 'bottom start', 'bottom end'] },
  { key: 'offset', type: 'string', default: '' },
  { key: 'touchPosition', type: 'boolean', default: false },
  { key: 'persistent', type: 'boolean', default: false },
  { key: 'separateClosePopup', type: 'boolean', default: false },
  { key: 'square', type: 'boolean', default: false },
  { key: 'maxHeight', type: 'string', default: '' },
  { key: 'maxWidth', type: 'string', default: '' },
]
