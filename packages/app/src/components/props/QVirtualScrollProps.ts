// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qVirtualScrollDefaults = {
  virtualScrollHorizontal: false,
  virtualScrollSliceSize: '10',
  virtualScrollSliceRatioBefore: '1',
  virtualScrollSliceRatioAfter: '1',
  virtualScrollItemSize: '24',
  virtualScrollStickySizeStart: '0',
  virtualScrollStickySizeEnd: '0',
  tableColspan: '',
  type: 'list',
  items: [],
  itemsSize: 0,
  itemsFn: '',
  scrollTarget: '',
} as const

export const qVirtualScrollSchema: PropSchema[] = [
  { key: 'virtualScrollHorizontal', type: 'boolean', default: false },
  { key: 'virtualScrollSliceSize', type: 'string', default: '10' },
  { key: 'virtualScrollSliceRatioBefore', type: 'string', default: '1' },
  { key: 'virtualScrollSliceRatioAfter', type: 'string', default: '1' },
  { key: 'virtualScrollItemSize', type: 'string', default: '24' },
  { key: 'virtualScrollStickySizeStart', type: 'string', default: '0' },
  { key: 'virtualScrollStickySizeEnd', type: 'string', default: '0' },
  { key: 'tableColspan', type: 'string', default: '' },
  { key: 'type', type: 'select', default: 'list', options: ['list', 'table'] },
  { key: 'items', type: 'string', default: [] },
  { key: 'itemsSize', type: 'number', default: 0 },
  { key: 'itemsFn', type: 'string', default: '' },
  { key: 'scrollTarget', type: 'string', default: '' },
]
