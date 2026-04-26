import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { UserCredentials } from '../test-data/users';

export class LoginPage extends BasePage {
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page.locator(this.loginButton)).toBeVisible();
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.page.fill(this.usernameInput, credentials.username);
    await this.page.fill(this.passwordInput, credentials.password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.page.locator(this.errorMessage).innerText();
  }

  async isErrorVisible(): Promise<boolean> {
    return this.page.locator(this.errorMessage).isVisible();
  }
}
