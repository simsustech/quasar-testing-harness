// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-dev/tools generate:props

import type { PropSchema } from '../../types/props'

export const qItemDefaults = {
  to: '',
  exact: false,
  replace: false,
  activeClass: 'q-router-link--active',
  exactActiveClass: 'q-router-link--exact-active',
  href: '',
  target: '',
  disable: false,
  active: '',
  dark: '',
  clickable: false,
  dense: false,
  insetLevel: 0,
  tabindex: '',
  tag: 'div',
  manualFocus: false,
  focused: false,
} as const

export const qItemSchema: PropSchema[] = [
  { key: 'to', type: 'string', default: '' },
  { key: 'exact', type: 'boolean', default: false },
  { key: 'replace', type: 'boolean', default: false },
  { key: 'activeClass', type: 'string', default: 'q-router-link--active' },
  { key: 'exactActiveClass', type: 'string', default: 'q-router-link--exact-active' },
  { key: 'href', type: 'string', default: '' },
  { key: 'target', type: 'string', default: '' },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'active', type: 'string', default: '' },
  { key: 'dark', type: 'string', default: '' },
  { key: 'clickable', type: 'boolean', default: false },
  { key: 'dense', type: 'boolean', default: false },
  { key: 'insetLevel', type: 'number', default: 0 },
  { key: 'tabindex', type: 'string', default: '' },
  { key: 'tag', type: 'string', default: 'div' },
  { key: 'manualFocus', type: 'boolean', default: false },
  { key: 'focused', type: 'boolean', default: false },
]
