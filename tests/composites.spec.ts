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
