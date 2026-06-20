// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qDialogDefaults = {
  transitionShow: 'fade',
  transitionHide: 'fade',
  transitionDuration: '300',
  modelValue: '',
  persistent: false,
  noEscDismiss: false,
  noBackdropDismiss: false,
  noRouteDismiss: false,
  autoClose: false,
  seamless: false,
  backdropFilter: '',
  maximized: false,
  fullWidth: false,
  fullHeight: false,
  position: 'standard',
  square: false,
  noRefocus: false,
  noFocus: false,
  noShake: false,
  allowFocusOutside: false,
} as const

export const qDialogSchema: PropSchema[] = [
  { key: 'transitionShow', type: 'string', default: 'fade' },
  { key: 'transitionHide', type: 'string', default: 'fade' },
  { key: 'transitionDuration', type: 'string', default: '300' },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'persistent', type: 'boolean', default: false },
  { key: 'noEscDismiss', type: 'boolean', default: false },
  { key: 'noBackdropDismiss', type: 'boolean', default: false },
  { key: 'noRouteDismiss', type: 'boolean', default: false },
  { key: 'autoClose', type: 'boolean', default: false },
  { key: 'seamless', type: 'boolean', default: false },
  { key: 'backdropFilter', type: 'string', default: '' },
  { key: 'maximized', type: 'boolean', default: false },
  { key: 'fullWidth', type: 'boolean', default: false },
  { key: 'fullHeight', type: 'boolean', default: false },
  { key: 'position', type: 'select', default: 'standard', options: ['standard', 'top', 'right', 'bottom', 'left'] },
  { key: 'square', type: 'boolean', default: false },
  { key: 'noRefocus', type: 'boolean', default: false },
  { key: 'noFocus', type: 'boolean', default: false },
  { key: 'noShake', type: 'boolean', default: false },
  { key: 'allowFocusOutside', type: 'boolean', default: false },
]
