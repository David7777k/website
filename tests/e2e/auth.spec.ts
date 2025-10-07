import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should show login page', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Check form elements
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Увійти")')).toBeVisible()
  })

  test('should login with demo credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill credentials
    await page.fill('input[type="email"]', 'demo@panda.com')
    await page.fill('input[type="password"]', 'demo123')
    
    // Submit form
    await page.click('button:has-text("Увійти")')
    
    // Wait for redirect
    await page.waitForURL('/', { timeout: 10000 })
    
    // Check if logged in (profile link should be visible)
    await expect(page.locator('text=Профіль')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Fill invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Submit form
    await page.click('button:has-text("Увійти")')
    
    // Wait a bit for error message
    await page.waitForTimeout(2000)
    
    // Should stay on login page or show error
    await expect(page).toHaveURL(/\/auth/)
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/auth/login')
    
    // Click register link
    await page.click('text=Реєстрація')
    
    // Should navigate to register page
    await expect(page).toHaveURL(/\/auth\/register/)
  })
})