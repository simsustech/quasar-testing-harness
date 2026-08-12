import { test, expect } from '@playwright/test'

const STYLES = ['md3', 'md2', 'unstyled'] as const

interface Pattern {
  id: string
  name: string
  tags: string[]
  click?: string
  hover?: string
}
const patterns: Pattern[] = [
  {
    id: 'composite-btn-tooltip',
    name: 'QBtn + QTooltip',
    tags: ['.q-btn'],
    hover: '.q-btn:first-of-type'
  },
  {
    id: 'composite-btn-badge',
    name: 'QBtn + QBadge',
    tags: ['.q-btn', '.q-badge']
  },
  {
    id: 'composite-card-actions',
    name: 'QCard + QCardActions + QBtn',
    tags: ['.q-card', '.q-card__actions', '.q-btn']
  },
  {
    id: 'composite-card-item-avatar',
    name: 'QCard + QItem + QAvatar',
    tags: ['.q-card', '.q-item', '.q-avatar']
  },
  {
    id: 'composite-toolbar-btns',
    name: 'QToolbar + QBtn',
    tags: ['.q-toolbar', '.q-btn']
  },
  {
    id: 'composite-toolbar-tabs',
    name: 'QToolbar + QTabs',
    tags: ['.q-toolbar', '.q-tabs', '.q-tab']
  },
  {
    id: 'composite-item-avatar',
    name: 'QItem + QAvatar',
    tags: ['.q-item', '.q-avatar', '.q-item__label']
  },
  {
    id: 'composite-item-badge',
    name: 'QItem + QBadge',
    tags: ['.q-item', '.q-badge']
  },
  {
    id: 'composite-item-checkbox',
    name: 'QItem + QCheckbox',
    tags: ['.q-item', '.q-checkbox']
  },
  {
    id: 'composite-item-radio',
    name: 'QItem + QRadio',
    tags: ['.q-item', '.q-radio']
  },
  {
    id: 'composite-item-toggle',
    name: 'QItem + QIcon + QToggle',
    tags: ['.q-item', '.q-icon', '.q-toggle']
  },
  {
    id: 'composite-expansion-card',
    name: 'QExpansionItem + QCard',
    tags: ['.q-expansion-item', '.q-card']
  },
  {
    id: 'composite-btn-dialog',
    name: 'QBtn + QDialog + QCard',
    tags: ['.q-btn'],
    click: '.q-btn:first-of-type'
  },
  {
    id: 'composite-header-toolbar',
    name: 'QHeader + QToolbar + QBtn',
    tags: ['.q-header', '.q-toolbar', '.q-btn', '.q-page']
  },
  {
    id: 'composite-header-tabs',
    name: 'QHeader + QToolbar + QTabs',
    tags: ['.q-header', '.q-toolbar', '.q-tabs', '.q-tab']
  },
  {
    id: 'composite-drawer-items',
    name: 'QDrawer + QItem + QIcon',
    tags: ['.q-drawer', '.q-item', '.q-icon', '.q-scrollarea']
  },
  {
    id: 'composite-fab-actions',
    name: 'QFab + QFabAction',
    tags: ['.q-fab'],
    click: '.q-fab'
  },
  {
    id: 'composite-form-input-btn',
    name: 'QForm + QInput + QBtn',
    tags: ['.q-form', '.q-input', '.q-btn']
  },
  {
    id: 'composite-input-icon',
    name: 'QInput + QIcon',
    tags: ['.q-input', '.q-icon']
  },
  {
    id: 'composite-select-chips',
    name: 'QSelect + QChip',
    tags: ['.q-select', '.q-chip']
  },
  {
    id: 'composite-field-icon',
    name: 'QField + QIcon',
    tags: ['.q-field', '.q-icon']
  },
  {
    id: 'composite-knob-icon',
    name: 'QKnob + QIcon',
    tags: ['.q-knob', '.q-icon']
  },
  {
    id: 'composite-tabs-panels',
    name: 'QTabs + QTabPanels',
    tags: ['.q-tabs', '.q-tab-panels', '.q-tab-panel']
  },
  {
    id: 'composite-inner-loading',
    name: 'QInnerLoading + QCard',
    tags: ['.q-card', '.q-inner-loading']
  },
  {
    id: 'composite-banner-btn',
    name: 'QBanner + QBtn',
    tags: ['.q-banner', '.q-btn']
  },
  {
    id: 'composite-progress-badge',
    name: 'QLinearProgress + QBadge',
    tags: ['.q-linear-progress', '.q-badge']
  },
  {
    id: 'composite-checkbox-item',
    name: 'QCheckbox + QItem',
    tags: ['.q-checkbox', '.q-item']
  },
  // Interaction-based: verify on click/open
  {
    id: 'composite-menu-list',
    name: 'QMenu + QList + QItem (click to open)',
    tags: ['.q-btn'],
    click: '.q-btn:first-of-type'
  },
  {
    id: 'composite-dropdown-list',
    name: 'QBtnDropdown + QList + QItem (click to open)',
    tags: ['.q-btn-dropdown'],
    click: '.q-btn-dropdown:first-of-type'
  },
  // Additional page patterns (previously untested)
  {
    id: 'composite-bar-icons',
    name: 'QBar + QIcon + QBtn',
    tags: ['.q-bar', '.q-icon', '.q-btn']
  },
  {
    id: 'composite-carousel',
    name: 'QCarousel + QCarouselSlide',
    tags: ['.q-carousel', '.q-carousel__slide']
  },
  {
    id: 'composite-chat-avatar',
    name: 'QChatMessage',
    tags: ['.q-message']
  },
  {
    id: 'composite-footer-toolbar',
    name: 'QFooter + QToolbar',
    tags: ['.q-footer', '.q-toolbar']
  },
  {
    id: 'composite-icon-badge',
    name: 'QIcon + QBadge',
    tags: ['.q-icon', '.q-badge']
  },
  {
    id: 'composite-slider-badge',
    name: 'QSlider',
    tags: ['.q-slider']
  },
  {
    id: 'composite-table-pagination',
    name: 'QTable + QPagination + QInput',
    tags: ['.q-table', '.q-input']
  },
  {
    id: 'composite-toolbar-breadcrumbs',
    name: 'QToolbar + QBreadcrumbs',
    tags: ['.q-toolbar', '.q-breadcrumbs']
  },
  // New patterns from Quasar docs examples
  {
    id: 'composite-menu-separator',
    name: 'QBtn + QMenu + QSeparator',
    // Menu content teleports to the body, so only the trigger is assertable
    // within the section.
    tags: ['.q-btn']
  },
  {
    id: 'composite-input-toggle',
    name: 'QIcon + QInput + QToggle',
    tags: ['.q-icon', '.q-input', '.q-toggle']
  },
  {
    id: 'composite-card-skeleton',
    name: 'QCard + QItem + QSkeleton',
    tags: ['.q-card', '.q-item', '.q-skeleton']
  },
  {
    id: 'composite-card-img',
    name: 'QCard + QResponsive + QBtn',
    tags: ['.q-card', '.q-responsive', '.q-btn']
  },
  {
    id: 'composite-input-btn',
    name: 'QInput + QBtn',
    tags: ['.q-input', '.q-btn']
  },
  {
    id: 'composite-date-input',
    name: 'QInput + QDate + QPopupProxy',
    tags: ['.q-input', '.q-icon']
  },
  {
    id: 'composite-date-time',
    name: 'QBadge + QDate + QTime',
    tags: ['.q-badge', '.q-date', '.q-time']
  },
  {
    id: 'composite-card-expansion',
    name: 'QCard + QExpansionItem + QSeparator',
    tags: ['.q-card', '.q-expansion-item', '.q-separator']
  },
  {
    id: 'composite-form-toggle',
    name: 'QForm + QToggle + QBtn',
    tags: ['.q-form', '.q-toggle', '.q-btn']
  },
  {
    id: 'composite-btngroup',
    name: 'QBtnGroup + QBtn',
    tags: ['.q-btn-group', '.q-btn']
  },
  {
    id: 'composite-stepper-btn',
    name: 'QStepper + QBtn',
    tags: ['.q-stepper', '.q-stepper__step', '.q-btn']
  },
  {
    id: 'composite-chat-input',
    name: 'QChatMessage + QInput',
    tags: ['.q-message', '.q-input', '.q-btn']
  },
  {
    id: 'composite-rating-btn',
    name: 'QRating + QBtn',
    tags: ['.q-rating', '.q-btn']
  },
  {
    id: 'composite-breadcrumbs-icons',
    name: 'QBreadcrumbs + QIcon',
    tags: ['.q-breadcrumbs', '.q-breadcrumbs__el', '.q-icon']
  },
  {
    id: 'composite-timeline-avatar',
    name: 'QTimeline + QAvatar',
    tags: ['.q-timeline', '.q-timeline__entry', '.q-avatar']
  }
]

for (const p of patterns) {
  test.describe(p.name, () => {
    for (const style of STYLES) {
      test(`renders with ?style=${style}`, async ({ page }) => {
        test.setTimeout(30_000)
        await page.goto('/composites?style=' + style, {
          waitUntil: 'networkidle'
        })
        await expect(page.locator('[data-testid="' + p.id + '"]')).toBeVisible({
          timeout: 10_000
        })
        // Hover to reveal tooltips etc.
        if (p.hover) {
          await page.locator('[data-testid="' + p.id + '"] ' + p.hover).hover()
          await page.waitForTimeout(300)
        }
        // Click to open menus/dropdowns/dialogs if needed
        if (p.click) {
          await page.locator('[data-testid="' + p.id + '"] ' + p.click).click()
          await page.waitForTimeout(300)
        }
        for (const tag of p.tags) {
          await expect(
            page.locator('[data-testid="' + p.id + '"] ' + tag).first()
          ).toBeVisible({ timeout: 5_000 })
        }
      })
    }
  })
}
