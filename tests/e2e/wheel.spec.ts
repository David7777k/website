import { test, expect } from '@playwright/test'

test.describe('Wheel of Fortune', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', 'demo@panda.com')
    await page.fill('input[type="password"]', 'demo123')
    await page.click('button:has-text("Увійти")')
    await page.waitForURL('/')
  })

  test('should show wheel page when authenticated', async ({ page }) => {
    await page.goto('/wheel')
    
    // Check page loads
    await expect(page.locator('text=Колесо Фортуни')).toBeVisible()
    
    // Should show wheel status
    await page.waitForLoadState('networkidle')
  })

  test('should show wheel status (ready or cooldown)', async ({ page }) => {
    await page.goto('/wheel')
    await page.waitForLoadState('networkidle')
    
    // Check for either "ready" or "cooldown" state
    const hasReadyButton = await page.locator('button:has-text("Крутити колесо")').count()
    const hasCooldownMessage = await page.locator('text=Колесо заблоковано').count()
    
    expect(hasReadyButton > 0 || hasCooldownMessage > 0).toBeTruthy()
  })

  test('should display wheel rules', async ({ page }) => {
    await page.goto('/wheel')
    
    // Check rules section
    await expect(page.locator('text=Правила гри')).toBeVisible()
    await expect(page.locator('text=Безкоштовне обертання раз на 7 днів')).toBeVisible()
  })

  test('should show prizes preview', async ({ page }) => {
    await page.goto('/wheel')
    
    // Check prizes section
    await expect(page.locator('text=Можливі призи')).toBeVisible()
  })

  test('should open wheel modal from floating button', async ({ page }) => {
    await page.goto('/')
    
    // Click floating wheel button
    await page.click('a[href="/wheel"]')
    
    // Should navigate to wheel page
    await expect(page).toHaveURL('/wheel')
  })
})