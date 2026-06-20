/**
 * Single source of truth for the Quasar component manifest.
 *
 * Each entry defines a route + a lazily-imported page. Pages that don't
 * exist yet are loaded dynamically — if the file is missing the route still
 * works and the page shows a "Not implemented" placeholder (see the catch-all
 * handler in routes.ts).
 *
 * To add a new component:
 *   1. Add an entry to this list
 *   2. Create src/pages/q-{slug}/Q{Name}Page.vue
 *   3. Create src/components/props/Q{Name}Props.ts
 */

export type Milestone = 'M1' | 'M2' | 'M3'

export interface ComponentEntry {
  name: string
  slug: string
  milestone: Milestone
}

export const components: ComponentEntry[] = [
  // M1 — simple / high-value
  { name: 'QBtn', slug: 'q-btn', milestone: 'M1' },
  { name: 'QAjaxBar', slug: 'q-ajax-bar', milestone: 'M1' },
  { name: 'QAvatar', slug: 'q-avatar', milestone: 'M1' },
  { name: 'QBadge', slug: 'q-badge', milestone: 'M1' },
  { name: 'QBanner', slug: 'q-banner', milestone: 'M1' },
  { name: 'QBar', slug: 'q-bar', milestone: 'M1' },
  { name: 'QBreadcrumbs', slug: 'q-breadcrumbs', milestone: 'M1' },
  { name: 'QBtnDropdown', slug: 'q-btn-dropdown', milestone: 'M1' },
  { name: 'QBtnGroup', slug: 'q-btn-group', milestone: 'M1' },
  { name: 'QBtnToggle', slug: 'q-btn-toggle', milestone: 'M1' },
  { name: 'QCard', slug: 'q-card', milestone: 'M1' },
  { name: 'QCheckbox', slug: 'q-checkbox', milestone: 'M1' },
  { name: 'QChip', slug: 'q-chip', milestone: 'M1' },
  { name: 'QCircularProgress', slug: 'q-circular-progress', milestone: 'M1' },
  { name: 'QDialog', slug: 'q-dialog', milestone: 'M1' },
  { name: 'QFab', slug: 'q-fab', milestone: 'M1' },
  { name: 'QField', slug: 'q-field', milestone: 'M1' },
  { name: 'QIcon', slug: 'q-icon', milestone: 'M1' },
  { name: 'QImg', slug: 'q-img', milestone: 'M1' },
  { name: 'QInfiniteScroll', slug: 'q-infinite-scroll', milestone: 'M1' },
  { name: 'QInnerLoading', slug: 'q-inner-loading', milestone: 'M1' },
  { name: 'QInput', slug: 'q-input', milestone: 'M1' },
  { name: 'QItem', slug: 'q-item', milestone: 'M1' },
  { name: 'QLinearProgress', slug: 'q-linear-progress', milestone: 'M1' },
  { name: 'QRadio', slug: 'q-radio', milestone: 'M1' },
  { name: 'QRating', slug: 'q-rating', milestone: 'M1' },
  { name: 'QSelect', slug: 'q-select', milestone: 'M1' },
  { name: 'QSeparator', slug: 'q-separator', milestone: 'M1' },
  { name: 'QSkeleton', slug: 'q-skeleton', milestone: 'M1' },
  { name: 'QSpinner', slug: 'q-spinner', milestone: 'M1' },
  { name: 'QToggle', slug: 'q-toggle', milestone: 'M1' },
  { name: 'QTooltip', slug: 'q-tooltip', milestone: 'M1' },

  // M2 — interactive / composite
  { name: 'QCarousel', slug: 'q-carousel', milestone: 'M2' },
  { name: 'QChat', slug: 'q-chat', milestone: 'M2' },
  { name: 'QColor', slug: 'q-color', milestone: 'M2' },
  { name: 'QDate', slug: 'q-date', milestone: 'M2' },
  { name: 'QDrawer', slug: 'q-drawer', milestone: 'M2' },
  { name: 'QExpansionItem', slug: 'q-expansion-item', milestone: 'M2' },
  { name: 'QFile', slug: 'q-file', milestone: 'M2' },
  { name: 'QForm', slug: 'q-form', milestone: 'M2' },
  { name: 'QKnob', slug: 'q-knob', milestone: 'M2' },
  { name: 'QMarkupTable', slug: 'q-markup-table', milestone: 'M2' },
  { name: 'QMenu', slug: 'q-menu', milestone: 'M2' },
  { name: 'QOptionGroup', slug: 'q-option-group', milestone: 'M2' },
  { name: 'QPagination', slug: 'q-pagination', milestone: 'M2' },
  { name: 'QParallax', slug: 'q-parallax', milestone: 'M2' },
  { name: 'QRange', slug: 'q-range', milestone: 'M2' },
  { name: 'QScrollArea', slug: 'q-scroll-area', milestone: 'M2' },
  { name: 'QSlider', slug: 'q-slider', milestone: 'M2' },
  { name: 'QStepper', slug: 'q-stepper', milestone: 'M2' },
  { name: 'QTabPanels', slug: 'q-tab-panels', milestone: 'M2' },
  { name: 'QTabs', slug: 'q-tabs', milestone: 'M2' },
  { name: 'QTime', slug: 'q-time', milestone: 'M2' },
  { name: 'QTimeline', slug: 'q-timeline', milestone: 'M2' },
  { name: 'QToolbar', slug: 'q-toolbar', milestone: 'M2' },

  // M3 — complex / layout
  { name: 'QEditor', slug: 'q-editor', milestone: 'M3' },
  { name: 'QFooter', slug: 'q-footer', milestone: 'M3' },
  { name: 'QHeader', slug: 'q-header', milestone: 'M3' },
  { name: 'QIntersection', slug: 'q-intersection', milestone: 'M3' },
  { name: 'QLayout', slug: 'q-layout', milestone: 'M3' },
  { name: 'QNoSsr', slug: 'q-no-ssr', milestone: 'M3' },
  { name: 'QPage', slug: 'q-page', milestone: 'M3' },
  { name: 'QPageScroller', slug: 'q-page-scroller', milestone: 'M3' },
  { name: 'QPageSticky', slug: 'q-page-sticky', milestone: 'M3' },
  { name: 'QPopupEdit', slug: 'q-popup-edit', milestone: 'M3' },
  { name: 'QPullToRefresh', slug: 'q-pull-to-refresh', milestone: 'M3' },
  { name: 'QResponsive', slug: 'q-responsive', milestone: 'M3' },
  { name: 'QSlideItem', slug: 'q-slide-item', milestone: 'M3' },
  { name: 'QSpace', slug: 'q-space', milestone: 'M3' },
  { name: 'QSplitter', slug: 'q-splitter', milestone: 'M3' },
  { name: 'QTable', slug: 'q-table', milestone: 'M3' },
  { name: 'QTree', slug: 'q-tree', milestone: 'M3' },
  { name: 'QUploader', slug: 'q-uploader', milestone: 'M3' },
  { name: 'QVideo', slug: 'q-video', milestone: 'M3' },
  { name: 'QVirtualScroll', slug: 'q-virtual-scroll', milestone: 'M3' }
]
