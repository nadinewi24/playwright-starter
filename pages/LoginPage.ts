import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object: Alles zur Login-Seite steht HIER.
 * Ändert sich die Seite (z. B. durch ein Appian-Update), passt man nur
 * diese Datei an, nicht jeden einzelnen Test.
 */
export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    // Stabile Locatoren: so, wie Nutzer:innen die Seite sehen
    this.username = page.getByPlaceholder('Username');
    this.password = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.getByTestId('error');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  async expectError(text: string | RegExp) {
    await expect(this.errorMessage).toContainText(text);
  }
}
