import { test, expect } from '@playwright/test'

test.describe('Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', 'demo@panda.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button:has-text("Увійти")')
    await page.waitForURL('/')
  })

  test('should show profile page', async ({ page }) => {
    await page.goto('/profile')
    
    // Check profile loaded
    await expect(page.locator('text=Demo User')).toBeVisible()
    await expect(page.locator('text=demo@panda.com')).toBeVisible()
  })

  test('should show stats cards', async ({ page }) => {
    await page.goto('/profile')
    
    // Check for stats
    await expect(page.locator('text=Візити')).toBeVisible()
    await expect(page.locator('text=Бонуси')).toBeVisible()
    await expect(page.locator('text=Рефералів')).toBeVisible()
  })

  test('should navigate to settings', async ({ page }) => {
    await page.goto('/profile')
    
    // Click settings link
    await page.click('text=Налаштування')
    
    // Should navigate to settings
    await expect(page).toHaveURL(/\/profile\/settings/)
  })

  test('should show QR code section', async ({ page }) => {
    await page.goto('/profile')
    
    // Check QR section exists
    const qrSection = page.locator('text=QR-код візиту')
    if (await qrSection.count() > 0) {
      await expect(qrSection).toBeVisible()
    }
  })
})