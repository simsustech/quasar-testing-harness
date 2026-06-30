// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qBreadcrumbsDefaults = {
  separator: '/',
  activeColor: 'primary',
  gutter: 'sm',
  separatorColor: '',
  align: 'left',
} as const

export const qBreadcrumbsSchema: PropSchema[] = [
  { key: 'separator', type: 'string', default: '/' },
  { key: 'activeColor', type: 'string', default: 'primary' },
  { key: 'gutter', type: 'select', default: 'sm', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] },
  { key: 'separatorColor', type: 'string', default: '' },
  { key: 'align', type: 'select', default: 'left', options: ['left', 'center', 'right', 'between', 'around', 'evenly'] },
]
