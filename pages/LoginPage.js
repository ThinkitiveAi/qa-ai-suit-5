const { expect } = require('@playwright/test');

/**
 * Page Object Model for Login Page
 */
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page 
   */
  constructor(page) {
    this.page = page;
    
    // Selectors
    this.usernameInput = '#username';
    this.passwordInput = '#password';
    this.loginButton = 'button[type="submit"]';
    this.errorMessage = '.error-message';
    this.forgotPasswordLink = 'a:has-text("Forgot Password")';
  }

  /**
   * Navigate to login page
   */
  async navigate() {
    await this.page.goto('/login');
  }

  /**
   * Login with credentials
   * @param {string} username 
   * @param {string} password 
   */
  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  /**
   * Check if error message is displayed
   * @param {string} expectedMessage 
   */
  async verifyErrorMessage(expectedMessage) {
    const errorElement = this.page.locator(this.errorMessage);
    await expect(errorElement).toBeVisible();
    if (expectedMessage) {
      await expect(errorElement).toContainText(expectedMessage);
    }
  }

  /**
   * Click on forgot password link
   */
  async clickForgotPassword() {
    await this.page.click(this.forgotPasswordLink);
  }

  /**
   * Check if login page is loaded
   */
  async isLoaded() {
    await expect(this.page.locator(this.usernameInput)).toBeVisible();
    await expect(this.page.locator(this.passwordInput)).toBeVisible();
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }
}

module.exports = LoginPage; 