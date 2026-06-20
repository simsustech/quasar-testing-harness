// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qTooltipDefaults = {
  transitionShow: 'jump-down',
  transitionHide: 'jump-up',
  transitionDuration: '300',
  target: true,
  noParentEvent: false,
  modelValue: '',
  maxHeight: '',
  maxWidth: '',
  anchor: 'bottom middle',
  self: 'top middle',
  offset: '[ 14, 14 ]',
  scrollTarget: '',
  delay: 0,
  hideDelay: 0,
  persistent: false,
} as const

export const qTooltipSchema: PropSchema[] = [
  { key: 'transitionShow', type: 'string', default: 'jump-down' },
  { key: 'transitionHide', type: 'string', default: 'jump-up' },
  { key: 'transitionDuration', type: 'string', default: '300' },
  { key: 'target', type: 'string', default: true },
  { key: 'noParentEvent', type: 'boolean', default: false },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'maxHeight', type: 'string', default: '' },
  { key: 'maxWidth', type: 'string', default: '' },
  { key: 'anchor', type: 'select', default: 'bottom middle', options: ['top left', 'top middle', 'top right', 'top start', 'top end', 'center left', 'center middle', 'center right', 'center start', 'center end', 'bottom left', 'bottom middle', 'bottom right', 'bottom start', 'bottom end'] },
  { key: 'self', type: 'select', default: 'top middle', options: ['top left', 'top middle', 'top right', 'top start', 'top end', 'center left', 'center middle', 'center right', 'center start', 'center end', 'bottom left', 'bottom middle', 'bottom right', 'bottom start', 'bottom end'] },
  { key: 'offset', type: 'string', default: '[ 14, 14 ]' },
  { key: 'scrollTarget', type: 'string', default: '' },
  { key: 'delay', type: 'number', default: 0 },
  { key: 'hideDelay', type: 'number', default: 0 },
  { key: 'persistent', type: 'boolean', default: false },
]
