// AUTO-GENERATED from Quasar docs JSON. Do not edit by hand.
// Regenerate with: pnpm --filter @quasar-testing-harness/tools generate:props

import type { PropSchema } from '../../types/props'

export const qDateDefaults = {
  name: '',
  landscape: false,
  mask: 'YYYY/MM/DD',
  locale: '',
  calendar: 'gregorian',
  color: '',
  textColor: '',
  dark: '',
  square: false,
  flat: false,
  bordered: false,
  readonly: false,
  disable: false,
  modelValue: '',
  title: '',
  subtitle: '',
  defaultYearMonth: '',
  defaultView: 'Calendar',
  yearsInMonthView: false,
  events: '',
  eventColor: '',
  options: '',
  navigationMinYearMonth: '',
  navigationMaxYearMonth: '',
  noUnset: false,
  firstDayOfWeek: '',
  todayBtn: false,
  minimal: false,
  multiple: false,
  range: false,
  emitImmediately: false
} as const

export const qDateSchema: PropSchema[] = [
  { key: 'name', type: 'string', default: '' },
  { key: 'landscape', type: 'boolean', default: false },
  { key: 'mask', type: 'string', default: 'YYYY/MM/DD' },
  { key: 'locale', type: 'string', default: '' },
  {
    key: 'calendar',
    type: 'select',
    default: 'gregorian',
    options: ['gregorian', 'persian']
  },
  { key: 'color', type: 'string', default: '' },
  { key: 'textColor', type: 'string', default: '' },
  { key: 'dark', type: 'string', default: '' },
  { key: 'square', type: 'boolean', default: false },
  { key: 'flat', type: 'boolean', default: false },
  { key: 'bordered', type: 'boolean', default: false },
  { key: 'readonly', type: 'boolean', default: false },
  { key: 'disable', type: 'boolean', default: false },
  { key: 'modelValue', type: 'string', default: '' },
  { key: 'title', type: 'string', default: '' },
  { key: 'subtitle', type: 'string', default: '' },
  { key: 'defaultYearMonth', type: 'string', default: '' },
  {
    key: 'defaultView',
    type: 'select',
    default: 'Calendar',
    options: ['Calendar', 'Months', 'Years']
  },
  { key: 'yearsInMonthView', type: 'boolean', default: false },
  { key: 'events', type: 'string', default: '' },
  { key: 'eventColor', type: 'string', default: '' },
  { key: 'options', type: 'string', default: '' },
  { key: 'navigationMinYearMonth', type: 'string', default: '' },
  { key: 'navigationMaxYearMonth', type: 'string', default: '' },
  { key: 'noUnset', type: 'boolean', default: false },
  { key: 'firstDayOfWeek', type: 'string', default: '' },
  { key: 'todayBtn', type: 'boolean', default: false },
  { key: 'minimal', type: 'boolean', default: false },
  { key: 'multiple', type: 'boolean', default: false },
  { key: 'range', type: 'boolean', default: false },
  { key: 'emitImmediately', type: 'boolean', default: false }
]
