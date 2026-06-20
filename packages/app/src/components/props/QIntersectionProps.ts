// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qIntersectionDefaults = {
  tag: 'div',
  once: false,
  ssrPrerender: false,
  root: '',
  margin: '',
  threshold: '',
  transition: '',
  transitionDuration: '300',
  disable: false,
} as const

export const qIntersectionSchema: PropSchema[] = [
  { key: 'tag', type: 'string', default: 'div' },
  { key: 'once', type: 'boolean', default: false },
  { key: 'ssrPrerender', type: 'boolean', default: false },
  { key: 'root', type: 'string', default: '' },
  { key: 'margin', type: 'string', default: '' },
  { key: 'threshold', type: 'string', default: '' },
  { key: 'transition', type: 'string', default: '' },
  { key: 'transitionDuration', type: 'string', default: '300' },
  { key: 'disable', type: 'boolean', default: false },
]
