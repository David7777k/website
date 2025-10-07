import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/')
    
    // Check title
    await expect(page).toHaveTitle(/PANDA/)
    
    // Check hero section
    await expect(page.locator('text=PANDA Hookah')).toBeVisible()
  })

  test('should navigate to all main pages', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to Events
    await page.click('text=Афіша')
    await expect(page).toHaveURL(/\/events/)
    await page.waitForLoadState('networkidle')
    
    // Navigate to Menu
    await page.click('text=Меню')
    await expect(page).toHaveURL(/\/menu/)
    await page.waitForLoadState('networkidle')
    
    // Navigate to Music
    await page.click('text=Музика')
    await expect(page).toHaveURL(/\/music/)
    await page.waitForLoadState('networkidle')
    
    // Navigate back to Home
    await page.click('text=Головна')
    await expect(page).toHaveURL('/')
  })

  test('should navigate to wheel page', async ({ page }) => {
    await page.goto('/')
    
    // Click on wheel button (floating action or quick action)
    await page.click('text=Колесо')
    await expect(page).toHaveURL(/\/wheel/)
    
    // Should redirect to login (not authenticated)
    await expect(page).toHaveURL(/\/auth\/login/)
  })

  test('should show loading states', async ({ page }) => {
    await page.goto('/events')
    
    // Check that content loads
    await page.waitForLoadState('networkidle')
    await expect(page.locator('text=Події')).toBeVisible()
  })
})