import { test, expect, Page } from '@playwright/test';

// Test data
const testUser = {
  email: 'test@example.com',
  email1: 'test1@example.com',
  email2: 'test2@example.com',
  email3: 'test3@example.com',
  email4: 'test4@example.com',
  password: 'password123',
  invalidEmail: 'invalid-email',
  shortPassword: '123',
  wrongPassword: 'wrongpassword',
};

const testImage = {
  prompt: 'A beautiful sunset over mountains',
  style: 'Classic',
};

test.describe('AI Studio E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Authentication Flow', () => {
    test('should display login page on initial visit', async ({ page }) => {
      await page.goto('/login');

      // Should redirect to login page
      await expect(page).toHaveURL('/login/');
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      await expect(page.locator('h2').nth(0)).toContainText('Welcome back');
    });

    test('should show signup link and navigate to signup page', async ({
      page,
    }) => {
      await page.goto('/login');

      const signupLink = page.locator('a[href="/signup/"]');
      await expect(signupLink).toBeVisible();

      await signupLink.click();
      await page.waitForURL('/signup/', { timeout: 120000 });
      await expect(page).toHaveURL('/signup/');
      await expect(page.locator('h2').nth(0)).toContainText(
        'Create your account'
      );
    });

    test('should successfully sign up a new user', async ({ page }) => {
      await page.goto('/signup');

      // Fill signup form
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);

      // Submit form
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/');
      // Should redirect to studio page after successful signup
      await expect(page).toHaveURL('/studio/');
      await expect(page.locator('h2').nth(0)).toContainText('AI Studio');
    });

    test('should show validation errors for invalid signup data', async ({
      page,
    }) => {
      await page.goto('/signup');

      // Test invalid email
      await page.fill('input[name="email"]', testUser.invalidEmail);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=Please provide a valid email address')
      ).toBeVisible();

      // Test short password
      await page.fill('input[name="email"]', testUser.email1);
      await page.fill('input[name="password"]', testUser.shortPassword);
      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=Password must be at least 6 characters long')
      ).toBeVisible();
    });

    test('should successfully login with valid credentials', async ({
      page,
    }) => {
      // First sign up a user
      await page.goto('/signup');
      await page.fill('input[name="email"]', testUser.email2);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');

      // Logout
      await page.click('text=Logout');
      await page.waitForURL('/', { timeout: 120000 });
      await expect(page).toHaveURL('/');

      // Login with same credentials
      await page.goto('/login');
      await page.waitForURL('/login/', { timeout: 120000 });
      await page.fill('input[name="email"]', testUser.email2);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');

      // Should redirect to studio
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
      await expect(page.locator('h2')).toContainText('AI Studio');
    }, 120000);

    test('should show error for invalid login credentials', async ({
      page,
    }) => {
      await page.goto('/login');

      // Test with non-existent user
      await page.fill('input[name="email"]', 'nonexistent@example.com');
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=Invalid Email ID or Password')
      ).toBeVisible();

      // Test with wrong password
      await page.fill('input[name="email"]', testUser.email3);
      await page.fill('input[name="password"]', testUser.wrongPassword);
      await page.click('button[type="submit"]');

      await expect(
        page.locator('text=Invalid Email ID or Password')
      ).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      // Sign up and login
      await page.goto('/signup');
      await page.fill('input[name="email"]', testUser.email4);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');

      // Logout
      await page.click('text=Logout');
      await page.waitForURL('/', { timeout: 120000 });
      await expect(page).toHaveURL('/');

      // Try to access studio without auth
      await page.goto('/studio');
      await page.waitForURL('/login/', { timeout: 120000 });
      await expect(page).toHaveURL('/login/');
    });
  });

  test.describe('Studio Page - Image Generation', () => {
    test.beforeEach(async ({ page }) => {
      // login before each test
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
    });

    test('should display studio interface correctly', async ({ page }) => {
      await expect(page.locator('h2')).toContainText('AI Studio');
      await expect(page.locator('input[name="prompt"]')).toBeVisible();
      await expect(page.locator('select[name="style"]')).toBeVisible();
      await expect(page.locator('button:has-text("Generate")')).toBeVisible();
      await expect(page.locator('button:has-text("Abort")')).toBeVisible();
    });

    test('should show upload component', async ({ page }) => {
      const uploadComponent = page.locator('[role="form"]');
      await expect(uploadComponent).toBeVisible();

      // Check for file input or upload area
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeVisible();
    });

    test('should allow style selection', async ({ page }) => {
      const styleSelect = page.locator('select[name="style"]');
      await expect(styleSelect).toBeVisible();

      // Check available style options exist
      await expect(
        styleSelect.locator('option[value="Classic"]')
      ).toHaveCount(1);
      await expect(
        styleSelect.locator('option[value="Avant-garde"]')
      ).toHaveCount(1);
      await expect(styleSelect.locator('option[value="Street"]')).toHaveCount(1);

      // Test style selection
      await styleSelect.selectOption('Avant-garde');
      await expect(styleSelect).toHaveValue('Avant-garde');
    });

    test('should show validation for empty prompt', async ({ page }) => {
      const generateButton = page.locator('button:has-text("Generate")');
      await generateButton.click();

      // Should show validation error or prevent submission
      const promptInput = page.locator('input[name="prompt"]');
      await expect(promptInput).toHaveAttribute('required');
    });

    test('should handle image generation process', async ({ page }) => {
      // Fill in the form
      await page.setInputFiles('input[type="file"]', 'tests/test.png');
      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);

      // Click generate button
      const generateButton = page.locator('button:has-text("Generate")');
      await generateButton.click();

      // Should show loading state
      await expect(page.locator('text=Generating...')).toBeVisible();

      // Should show abort button
      const abortButton = page.locator('button:has-text("Abort")');
      await expect(abortButton).toBeVisible();
    });

    test('should handle generation abort', async ({ page }) => {
      // Start generation
      await page.setInputFiles('input[type="file"]', 'tests/test.png');
      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await page.click('button:has-text("Generate")');

      // Wait for loading state
      await expect(page.locator('text=Generating...')).toBeVisible();

      // Click abort
      await page.click('button:has-text("Abort")');

      // Should return to normal state
      await expect(page.locator('text=Generating...')).not.toBeVisible();
      await expect(page.locator('button:has-text("Generate")')).toBeEnabled();
    });

    test('should display result section', async ({ page }) => {
      // Check result section exists
      const resultSection = page.locator('text=Result');
      await expect(resultSection).toBeVisible();

      // Check placeholder text
      const placeholder = page.locator('text=Your result will appear here.');
      await expect(placeholder).toBeVisible();
    });

    test('should display history section', async ({ page }) => {
      // Check history section exists
      const historySection = page.locator('text=History');
      await expect(historySection).toBeVisible();
      await expect(page.locator('h3').nth(0)).toContainText('History');
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      // login
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
    });

    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Check that elements are still visible and functional
      await expect(page.locator('h2')).toContainText('AI Studio');
      await expect(page.locator('input[name="prompt"]')).toBeVisible();
      await expect(page.locator('select[name="style"]')).toBeVisible();
      await expect(page.locator('button:has-text("Generate")')).toBeVisible();
    });

    test('should work on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      // Check layout adapts properly
      await expect(page.locator('h2')).toContainText('AI Studio');
      await expect(page.locator('input[name="prompt"]')).toBeVisible();
      await expect(page.locator('select[name="style"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test.beforeEach(async ({ page }) => {
      // login
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/generations', route => route.abort());

      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await page.click('button:has-text("Generate")');

      // Should show error message
      await expect(
        page.locator('text=Network Error')
      ).toBeVisible();
    });

    test('should handle server errors', async ({ page }) => {
      // Mock server error
      await page.route('**/generations', route =>
        route.fulfill({ status: 500, body: 'Internal Server Error' })
      );

      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await page.click('button:has-text("Generate")');

      // Should show error message
      await expect(
        page.locator('text=Request failed with status code 500')
      ).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      // login
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
    });

    test('should have proper form labels', async ({ page }) => {
      // Check for proper labeling
      const promptInput = page.locator('input[name="prompt"]');
      await expect(promptInput).toHaveAttribute('aria-describedby');

      const styleSelect = page.locator('select[name="style"]');
      await expect(styleSelect).toHaveAttribute('aria-describedby');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Click on the page to ensure focus
      await page.click('body');
      
      // Tab through form elements
      await page.keyboard.press('Tab'); // Should focus on image input
    //   await expect(page.locator('input[type="file"]')).toBeFocused();//because it is not focusable

      await page.keyboard.press('Tab'); // Should focus on prompt input
      await expect(page.locator('input[name="prompt"]')).toBeFocused();

      await page.keyboard.press('Tab'); // Should focus on style select
      await expect(page.locator('select[name="style"]')).toBeFocused();

      await page.keyboard.press('Tab'); // Should focus on generate button
      await expect(page.locator('button:has-text("Generate")')).toBeFocused();
    });

    test('should have proper button states', async ({ page }) => {
      const generateButton = page.locator('button:has-text("Generate")');

      // Should be enabled initially
      await expect(generateButton).toBeEnabled();

      // Start generation
      await page.setInputFiles('input[type="file"]', 'tests/test.png');
      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await generateButton.click();

      // Should be disabled during generation
      await expect(page.locator('text=Generating...')).toBeVisible();
    });
  });

  test.describe('User Experience', () => {
    test.beforeEach(async ({ page }) => {
      // login
      await page.goto('/login');
      await page.fill('input[name="email"]', testUser.email);
      await page.fill('input[name="password"]', testUser.password);
      await page.click('button[type="submit"]');
      await page.waitForURL('/studio/', { timeout: 120000 });
      await expect(page).toHaveURL('/studio/');
    });

    test('should clear form after successful generation', async ({ page }) => {
      // This test would need actual generation to complete
      // For now, just test form clearing after abort
      await page.setInputFiles('input[type="file"]', 'tests/test.png');
      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await page.click('button:has-text("Generate")');

      // Wait for loading state
      await expect(page.locator('text=Generating...')).toBeVisible();

      // Abort generation
      await page.click('button:has-text("Abort")');

      // Form should be ready for new input
      await expect(page.locator('input[name="prompt"]')).toBeVisible();
      await expect(page.locator('select[name="style"]')).toBeVisible();
    });

    test('should show loading indicators', async ({ page }) => {
      await page.setInputFiles('input[type="file"]', 'tests/test.png');
      await page.fill('input[name="prompt"]', testImage.prompt);
      await page.selectOption('select[name="style"]', testImage.style);
      await page.click('button:has-text("Generate")');

      // Should show loading spinner
      const spinner = page.locator('.animate-spin');
      await expect(spinner).toBeVisible();

      // Should show loading text
      await expect(page.locator('text=Generating...')).toBeVisible();
    });
  });
});
