import { test, expect } from '@playwright/test'

test.describe('QToggle — functional', () => {
  test('toggles on click and updates the URL', async ({ page }) => {
    await page.goto('/q-toggle?label=Test&modelValue=true', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const toggle = page.locator('[data-testid="component-preview"]').getByRole('switch')
    await expect(toggle).toBeChecked()
    await expect(page).toHaveURL(/modelValue=true/)

    await toggle.click()
    await expect(toggle).not.toBeChecked()
    await expect(page).toHaveURL(/modelValue=false/)
  })

  test('control panel modelValue input drives the toggle', async ({ page }) => {
    await page.goto('/q-toggle?label=Test&modelValue=false', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const previewToggle = page.locator('[data-testid="component-preview"]').getByRole('switch')
    await expect(previewToggle).not.toBeChecked()

    const modelInput = page.locator('[data-prop-input="modelValue"]')
    await modelInput.fill('true')
    await expect(previewToggle).toBeChecked()
    await expect(page).toHaveURL(/modelValue=true/)
  })
})

test.describe('QCheckbox — functional', () => {
  test('toggles on click and updates the URL', async ({ page }) => {
    await page.goto('/q-checkbox?label=Test&modelValue=true', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const checkbox = page.locator('[data-testid="component-preview"]').getByRole('checkbox')
    await expect(checkbox).toBeChecked()
    await checkbox.click()
    await expect(checkbox).not.toBeChecked()
    await expect(page).toHaveURL(/modelValue=false/)
  })
})

test.describe('QSlider — functional', () => {
  test('slider renders and has the URL-driven value', async ({ page }) => {
    await page.goto('/q-slider?modelValue=50', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const slider = page.getByRole('slider')
    await expect(slider).toBeVisible()
    await expect(slider).toHaveAttribute('aria-valuenow', '50')
  })
})

test.describe('QBtn — functional', () => {
  test('button renders with given label', async ({ page }) => {
    await page.goto('/q-btn?label=ClickMe&color=primary', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const btn = page.locator('[data-testid="component-preview"]').getByRole('button')
    await expect(btn).toContainText('ClickMe')
  })

  test('disabled button is not clickable', async ({ page }) => {
    await page.goto('/q-btn?label=Off&disable=true&color=primary', { waitUntil: 'networkidle' })
    const btn = page.locator('[data-testid="component-preview"]').getByRole('button')
    await expect(btn).toBeDisabled()
  })
})

test.describe('QDialog — functional', () => {
  test('dialog is visible by default and closes with Cancel', async ({ page }) => {
    await page.goto('/q-dialog', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.q-dialog')).toBeVisible()

    const cancelBtn = page.getByRole('button', { name: 'Cancel' })
    await cancelBtn.click()
    await expect(page.locator('.q-dialog')).not.toBeVisible()
  })
})

test.describe('QSelect — functional', () => {
  test('select opens dropdown with options', async ({ page }) => {
    await page.goto('/q-select?modelValue=de&label=Country&style=unstyled', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    const select = page.locator('[data-testid="component-preview"] .q-select')
    await select.click()

    await expect(page.locator('.q-menu')).toBeVisible()
    expect(await page.locator('.q-menu .q-item').count()).toBe(5)
  })
})

test.describe('QMenu — functional', () => {
  test('menu opens on button click', async ({ page }) => {
    await page.goto('/q-menu?modelValue=false', { waitUntil: 'networkidle' })
    await expect(page.locator('.control-panel')).toBeVisible({ timeout: 10_000 })

    // Menu starts closed; click the button to open it.
    const btn = page.locator('[data-testid="component-preview"]').getByRole('button')
    await btn.click()

    await expect(page.locator('.q-menu')).toBeVisible()
    expect(await page.locator('.q-menu .q-item').count()).toBeGreaterThan(0)
  })
})
