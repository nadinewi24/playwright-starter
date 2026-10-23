import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

// Login-Tests brauchen eine LEERE Session (nicht eingeloggt)
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('erfolgreicher Login mit gültigem Benutzer', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.standard.username, users.standard.password);
    await expect(page).toHaveURL(/inventory/);
  });

  // Negativtests: genauso wichtig wie der Positivfall
  test('gesperrter Benutzer bekommt Fehlermeldung', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.locked.username, users.locked.password);
    await login.expectError('this user has been locked out');
  });

  test('falsche Zugangsdaten werden abgelehnt', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(users.invalid.username, users.invalid.password);
    await login.expectError('do not match');
  });

  test('leeres Formular zeigt Pflichtfeld-Hinweis', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginButton.click();
    await login.expectError('Username is required');
  });
});
