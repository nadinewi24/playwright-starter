import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

/**
 * Läuft EINMAL vor allen UI-Tests: einloggen und Session speichern.
 * Alle anderen Tests starten dann bereits eingeloggt -> schneller, stabiler.
 */
const authFile = '.auth/user.json';

setup('einloggen und Session speichern', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(users.standard.username, users.standard.password);
  await expect(page).toHaveURL(/inventory/);
  await page.context().storageState({ path: authFile });
});
