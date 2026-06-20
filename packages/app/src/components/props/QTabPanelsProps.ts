// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qTabPanelsDefaults = {
  modelValue: '',
  keepAlive: false,
  keepAliveInclude: '',
  keepAliveExclude: '',
  keepAliveMax: 0,
  animated: false,
  infinite: false,
  swipeable: false,
  vertical: false,
  transitionPrev: '# slide-right/slide-down',
  transitionNext: '# slide-left/slide-up',
  transitionDuration: '300',
  dark: '',
} as const

export const qTabPanelsSchema: PropSchema[] = [
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'keepAlive', type: 'boolean', default: false },
  { key: 'keepAliveInclude', type: 'string', default: '' },
  { key: 'keepAliveExclude', type: 'string', default: '' },
  { key: 'keepAliveMax', type: 'number', default: 0 },
  { key: 'animated', type: 'boolean', default: false },
  { key: 'infinite', type: 'boolean', default: false },
  { key: 'swipeable', type: 'boolean', default: false },
  { key: 'vertical', type: 'boolean', default: false },
  { key: 'transitionPrev', type: 'string', default: '# slide-right/slide-down' },
  { key: 'transitionNext', type: 'string', default: '# slide-left/slide-up' },
  { key: 'transitionDuration', type: 'string', default: '300' },
  { key: 'dark', type: 'string', default: '' },
]
